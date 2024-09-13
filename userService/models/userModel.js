const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [
            function () {
                return (this.role ?? this._update.$set.role) === 'employee';
            },
            'Παρακαλώ επιλέξτε υπηρεσία.'
        ]
    },
    name: {
        type: String,
        required: [
            function () {
                return (this.role ?? this._update.$set.role) !== 'employee';
            },
            'Παρακαλώ εισάγετε όνομα.'
        ]
    },
    firstName: {
        type: String,
        required: [
            function () {
                return (this.role ?? this._update.$set.role) === 'employee';
            },
            'Παρακαλώ εισάγετε όνομα.'
        ]
    },
    lastName: {
        type: String,
        required: [
            function () {
                return (this.role ?? this._update.$set.role) === 'employee';
            },
            'Παρακαλώ εισάγετε επώνυμο.'
        ]
    },
    motherName: {
        type: String,
        required: [
            function () {
                return (this.role ?? this._update.$set.role) === 'employee';
            },
            'Παρακαλώ εισάγετε όνομα και επώνυμο μητέρας.'
        ]
    },
    fatherName: {
        type: String,
        required: [
            function () {
                return (this.role ?? this._update.$set.role) === 'employee';
            },
            'Παρακαλώ εισάγετε όνομα και επώνυμο πατέρα.'
        ]
    },
    dateOfBirth: {
        type: Date,
        required: [
            function () {
                return (this.role ?? this._update.$set.role) === 'employee';
            },
            'Παρακαλώ εισάγετε ημερομηνία γέννησης.'
        ]
    },
    idNumber: {
        type: String,
        required: [
            function () {
                return (this.role ?? this._update.$set.role) === 'employee';
            },
            'Παρακαλώ εισάγετε αριθμό δελτίου ταυτότητας.'
        ],
        index: {
            unique: true,
            partialFilterExpression: { role: 'employee' },
            message: 'Ο αριθμός δελτίου ταυτότητας υπάρχει ήδη.'
        }
    },
    vatNumber: {
        type: String,
        required: [
            function () {
                return (this.role ?? this._update.$set.role) === 'employee';
            },
            'Παρακαλώ εισάγετε Α.Φ.Μ.'
        ],
        index: {
            unique: true,
            partialFilterExpression: { role: 'employee' },
            message: 'Το Α.Φ.Μ. υπάρχει ήδη.'
        }
    },
    phone: {
        type: String,
        required: [true, 'Παρακαλώ εισάγετε τηλέφωνο.'],
    },
    email: {
        type: String,
        required: [true, 'Παρακαλώ εισάγετε email.'],
        unique: [true, 'Το email χρησιμοποιείται ήδη.'],
        lowercase: true,
        validate: [validator.isEmail, 'Παρακαλώ εισάγετε ένα έγκυρο email.']
    },
    password: {
        type: String,
        required: [true, 'Παρακαλώ εισάγετε κωδικό.'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Παρακαλώ επιβεβαιώστε τον κωδικό σας.'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Οι κωδικοί δεν ταιριάζουν.'
        }
    },
    placeOfBirth: {
        type: String,
        required: [
            function () {
                return (this.role ?? this._update.$set.role) === 'employee';
            },
            'Παρακαλώ εισάγετε τόπο γέννησης.'
        ]
    },
    address: {
        type: {
            _id: false,
            city: {
                type: String,
                required: [true, 'Παρακαλώ εισάγετε πόλη.']
            },
            address: {
                type: String,
                required: [true, 'Παρακαλώ εισάγετε διεύθυνση.']
            },
            postalCode: {
                type: String,
                required: [true, 'Παρακαλώ εισάγετε ταχυδρομικό κώδικα.']
            },
        },
        required: [
            function () {
                return (this.role ?? this._update.$set.role) === 'employee';
            },
            'Παρακαλώ εισάγετε διεύθυνση.'
        ]
    },
    role: {
        type: String,
        enum: ['employee', 'publicService', 'auditService'],
        default: 'employee'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) {
        return next();
    }

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.virtual('employees', {
    ref: 'User',
    foreignField: 'service',
    localField: '_id'
});

userSchema.pre(/^find/, function(next) {
    if (this.options._recursed) {
        return next();
    }

    this.populate({
        path: 'employees',
        select: '_id',
        options: { _recursed: true }
    });

    this.populate({
        path: 'service',
        options: { _recursed: true }
    });

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
