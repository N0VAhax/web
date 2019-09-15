var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const SessionSchema = new mongoose.Schema(
        {
                uid: {
                        type: Number,
                        trim: true,
                        required: true
                },
                session_id: {
                        type: Number
                },
                ip_address: {
                        // Make sure all passwords are hashed
                        type: String,
                        required: true,
                },
                user_agent: {
                        type: String
                },
                created: {
                        type: Date,
                },
                expired: {
                        type: Date,
                },
        },
        { collection: 'sessions' },
);

SessionSchema.plugin(timestamps);

module.exports = exports = mongoose.model('Session', SessionSchema);
