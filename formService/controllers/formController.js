const Form = require('../models/formModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: 'public/files/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage }).single('file');

const facet = field => {
    return [
        {
            $group: {
                _id: null,
                [field]: {
                    $addToSet: `$${field}`
                }
            }
        },
        {
            $project: {
                _id: 0,
                [field]: 1
            }
        }
    ];
};

const camelCaseToTitleCase = camelCaseStr => {
    let words = camelCaseStr.replace(/([A-Z])/g, ' $1');

    words = words.charAt(0).toUpperCase() + words.slice(1);

    return words;
}

exports.getAllForms = catchAsync(async (req, res, next) => {
    const user = req.user || {
        role: req.headers['user_role'],
        id: req.headers['user_id'],
        email: req.headers['user_email']
    };

    // Sorting.
    let sort = req.query.sort || 'createdAt:desc';
    [order, direction] = sort.split(':');
    sort = { [order]: direction === 'asc' ? 1 : -1 }

    // Pagination.
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    // Filtering.
    const query = Object.assign({}, req.query);
    const excludedFields = ['page', 'sort', 'limit', 'search'];
    excludedFields.forEach(field => delete query[field]);
    Object.keys(query).forEach(key => {
        query[key] = Number(query[key]) || query[key];
    });

    const pipeline = [];

    // Search.
    if (req.query.search) {
        pipeline.push({
            $search: {
                index: 'forms',
                text: {
                    query: req.query.search,
                    path: ['userName', 'serviceName'],
                    fuzzy: { maxEdits: 2 }
                }
            }
        })
    }

    if (user.role !== 'auditService') {
        pipeline.push({
            $match: {
                $or: [
                    { user: user.id },
                    { service: user.id }
                ]
            }
        });
    } else {
        const year = (new Date()).getFullYear();
        const semester = (new Date).getMonth() < 6 ? 1 : 2;

        pipeline.push({
            $match: {
                $or: [
                    { $nor: [{ year: year, semester: semester }] },
                    { allApproved: true }
                ]
            }
        })
    }

    pipeline.push({
        $facet: {
            userName: facet('userName'),
            serviceName: facet('serviceName'),
            year: facet('year'),
            semester: facet('semester'),
            status: facet('status'),
            total: [
                { $match: query },
                { $count: 'total' }
            ],
            canCreateForm: [
                {
                    $match: {
                        user: user.id,
                        year: (new Date()).getFullYear(),
                        semester: (new Date()).getMonth() < 6 ? 1 : 2,
                    }
                },
                { $count: 'canCreateForm' },
                {
                    $project: {
                      canCreateForm: {
                        $cond: { if: { $gt: ['$canCreateForm', 0] }, then: false, else: true }
                      }
                    }
                }
            ],
            forms: [
                { $match: query },
                { $sort: sort },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'forms',
                        localField: '_id',
                        foreignField: 'parent',
                        as: 'children'
                    }
                },
                {
                    $addFields: {
                        hasChildren: {
                            $gt: [{ $size: '$children' }, 0]
                        }
                    }
                },
                { $project: { children: 0 } }
            ]
        }
    });

    const [{...data}] = await Form.aggregate(pipeline);

    if (!data) {
        return next(new AppError('No forms found', 404));
    }

    Object.keys(data).forEach(key => {
        if (key !== 'forms') {
            data[key] = data[key]?.[0]?.[key]

            if (key === 'canCreateForm') {
                data[key] = user.role === 'employee' && (data[key] === undefined || !!data[key]);
            } else if (key !== 'total') {
                data.filters = data.filters || {};
                if (data[key]?.length > 1) {
                    data.filters[key] = {
                        title: camelCaseToTitleCase(key),
                        options: data[key]
                    };
                }
                delete data[key];
            }
        }
    });

    res.status(200).json({
        status: 'success',
        results: data.forms.length,
        data
    });
});

exports.getFormById = catchAsync(async (req, res, next) => {
    const form = await Form.findById(req.params.id);

    if (!form) {
        return next(new AppError('No form found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { form }
    });
});

exports.createForm = catchAsync(async (req, res, next) => {
    const form = await Form.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { form }
    });
});

exports.updateForm = catchAsync(async (req, res, next) => {
    const form = await Form.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!form) {
        return next(new AppError('No form found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { form }
    });
});

exports.deleteForm = catchAsync(async (req, res, next) => {
    const form = await Form.findByIdAndDelete(req.params.id);

    if (!form) {
        return next(new AppError('No form found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.uploadFile = catchAsync(async (req, res, next) => {
    upload(req, res, error => {
        if (error) {
            return next(new AppError(error.message, 500));
        }

        if (!req.file) {
            return next(new AppError('No file provided!', 400));
        }

        res.status(200).json({
            status: 'success',
            data: { file: req.file }
        });
    });
});

exports.downloadFile = catchAsync(async (req, res, next) => {
    const filePath = path.resolve(req.body.uri);

    if (!fs.existsSync(filePath)) {
        return next(new AppError('File not found', 404));
    }

    res.sendFile(filePath, req.body.name, error => {
        if (error) {
            return next(new AppError(error.message, 500));
        }
    });
});

exports.updateUserData = catchAsync(async (user) => {
    await Form.updateMany(
        { user: user._id },
        {
            $set: {
                userName: `${user.firstName} ${user.lastName}`,
                email: user.email,
                service: user.service?._id,
                serviceName: user.service?.name,
            }
        }
    );
});
