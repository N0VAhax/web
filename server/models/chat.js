var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const ChatSchema = new mongoose.Schema(
        {
                chat_id: Number,
                uid: Number,
                message: String,
                is_bot: Boolean,
                channel: String,
                created: {
                        type: Date,
                }
        },
        { collection: 'chats' },
);

ChatSchema.plugin(timestamps);

module.exports = exports = mongoose.model('Chat', ChatSchema);
