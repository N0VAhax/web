var mongoose = require('mongoose');
var email = require('../email');
var timestamps = require('mongoose-timestamp');

const AccountSchema = new mongoose.Schema(
        {
                email: {
                        type: String,
                        lowercase: true,
                        trim: true,
                        index: true,
                        unique: true,
                        required: true,
                },
                uid: {
                        type: Number,
                        trim: true,
                        required: true
                },
                username: {
                        type: String,
                        lowercase: true,
                        trim: true,
                        index: true,
                        unique: true,
                        required: true,
                },
                password: {
                        // Make sure all passwords are hashed
                        type: String,
                        required: true,
                },
                gross_profit: Number,
                net_profit: Number,
                games_played: Number,
                withdrawals: {type: mongoose.Schema.ObjectId, ref: 'Funding'},
                preferences: {
                        notifications: {
                            type: Boolean,
                            default: true
                        },
                },
                recoveryCode: {
                        type: String,
                        trim: true,
                        default: '',
                },
                active: {
                        type: Boolean,
                        default: true,
                },
                admin: {
                        type: Boolean,
                        default: false,
                },
        },
        { collection: 'accounts' },
);

AccountSchema.pre('save', function(next) {
        if (!this.isNew) {
                next();
        }

        email({
                type: 'welcome',
                email: this.email,
        })
                .then(() => {
                        next();
                })
                .catch(err => {
                        logger.error(err);
                        next();
                });
});


AccountSchema.pre('findOneAndUpdate', function(next) {
        if (!this._update.recoveryCode) {
                return next();
        }

        email({
                type: 'password',
                email: this._conditions.email,
                passcode: this._update.recoveryCode,
        })
                .then(() => {
                        next();
                })
                .catch(err => {
                        logger.error(err);
                        next();
                });
});

AccountSchema.plugin(timestamps)
AccountSchema.index({ email: 1, username: 1 });

module.exports = exports = mongoose.model('Account', AccountSchema);
