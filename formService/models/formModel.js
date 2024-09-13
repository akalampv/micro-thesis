const mongoose = require('mongoose');
const dispatchEvent = require('./../utils/eventDispatcher');

const formSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    allApproved: {
        type: Boolean,
        default: false
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed'],
        default: 'pending'
    },
    comment: {
        type: String,
        select: false
    },
    year: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        enum: [1, 2],
        required: true
    },
    mainIncome: {
        type: {
            _id: false,
            role: {
                type: String,
                required: [true, 'Παρακαλώ εισάγετε την ιδιότητα της κύριας απασχόλησης.']
            },
            carrier: {
                type: String,
                required: [true, 'Παρακαλώ εισάγετε το φορέα της κύριας απασχόλησης.']
            },
            carrierCode: {
                type: String,
                required: [true, 'Παρακαλώ εισάγετε τον κωδικό φορέα της κύριας απασχόλησης.']
            },
            income: {
                type: [
                    {
                        type: {
                            _id: false,
                            gross: {
                                type: Number,
                                required: [true, 'Παρακαλώ εισάγετε τις ακαθάριστες αποδοχές για κάθε μήνα του εξαμήνου.']
                            },
                            net: {
                                type: Number,
                                required: [true, 'Παρακαλώ εισάγετε τις καθαρές αποδοχές για κάθε μήνα του εξαμήνου.']
                            },
                            file: {
                                type: {
                                    name: String,
                                    uri: String
                                },
                                required: [true, 'Παρακαλώ προσθέστε τη βεβαίωση αποδοχών της κύριας θέσης απασχόλησης για κάθε μήνα του εξαμήνου.']
                            }
                        },
                        required: true
                    }
                ],
                required: true,
            },
        },
        required: true,
    },
    extraIncome: {
        type: [
            {
                _id: false,
                role: {
                    type: String,
                    required: [true, 'Παρακαλώ εισάγετε την ιδιότητα για κάθε δευτερεύουσα απασχόληση.']
                },
                carrier: {
                    type: String,
                    required: [true, 'Παρακαλώ εισάγετε το φορέα για κάθε δευτερεύουσα απασχόληση.']
                },
                carrierCode: {
                    type: String,
                    required: [true, 'Παρακαλώ εισάγετε τον κωδικό φορέα για κάθε δευτερεύουσα απασχόληση.']
                },
                income: {
                    type: [
                        {
                            type: {
                                _id: false,
                                gross: {
                                    type: Number,
                                    required: [true, 'Παρακαλώ εισάγετε τις ακαθάριστες αποδοχές για κάθε μήνα του εξαμήνου.']
                                },
                                net: {
                                    type: Number,
                                    required: [true, 'Παρακαλώ εισάγετε τις καθαρές αποδοχές για κάθε μήνα του εξαμήνου.']
                                },
                                file: {
                                    type: {
                                        name: String,
                                        uri: String
                                    },
                                    required: [true, 'Παρακαλώ προσθέστε τη βεβαίωση αποδοχών της εκάστοτε δευτερεύουσας θέσης αποσχόλησης για κάθε μήνα του εξαμήνου.']
                                }
                            },
                            required: true
                        }
                    ],
                    required: true,
                },
                file: {
                    type: {
                        name: String,
                        uri: String
                    },
                    required: [true, 'Παρακαλώ προσθέστε τη σύμβαση εργασίας για κάθε δευτερεύουσα θέση απασχόλησης.']
                }
            }
        ],
        validate: {
            validator: function(v) {
                return v.length >= 1;
            },
            message: 'Παρακαλώ προσθέστε τουλάχιστον μία δευτερεύουσα απασχόληση.'
        },
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
})

formSchema.virtual('child', {
    ref: 'Form',
    foreignField: 'parent',
    localField: '_id',
    justOne: true
});

formSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'child',
        select: '_id'
    });

    next();
});

formSchema.post('findOneAndUpdate', async function(form, next) {
    const status = this._update.$set.status;
    const comment = this._update.$set.comment;

    const year = (new Date()).getFullYear();
    const semester = (new Date).getMonth() < 6 ? 1 : 2;

    if (
        status &&
        status !== 'completed' &&
        form.year === year &&
        form.semester === semester
    ) {
        const notApproved = status !== 'approved' || await Form.findOne({
            year: year,
            semester: semester,
            service: form.service,
            status: { $ne: 'approved' },
        });

        await Form.updateMany({
            year: year,
            semester: semester,
            service: form.service,
        }, {
            $set: {
                allApproved: !notApproved
            }
        });
    }

    if (status && status !== 'pending') {
        let statusMessage;

        switch (status) {
            case 'rejected':
                statusMessage = 'απποριφθεί';
                break;
            case 'approved':
                statusMessage = 'γίνει αποδεκτή';
                break;
            default:
                statusMessage = 'οριστικοποιηθεί';
                break;
        }

        let message = `Η δήλωση πολυθεσίας που υποβάλατε έχει ${statusMessage}.`;

        if (comment) {
            message += `\n\nΣχόλιο:\n${comment}`;
        }

        dispatchEvent('formStatusChanged', {
            value: JSON.stringify({
                email: form.email,
                subject: `Η δήλωση πολυθεσίας που υποβάλατε έχει ενημερωθεί`,
                message
            })
        });
    }

    next();
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
