var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const PlaysSchema = new mongoose.Schema(
        {
                game_id: {
                        type: Number,
                        trim: true,
                        required: true
                },
                uid: {
                        type: Number
                },
                cash_out: Number,
                auto_cash_out: Number,
                bet: Number,
                bonus: Number,
                created: {
                        type: Date,
                }
        },
        { collection: 'plays' },
);

PlaysSchema.plugin(timestamps);

module.exports = exports = mongoose.model('Plays', PlaysSchema);
