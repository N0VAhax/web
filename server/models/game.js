var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const GameSchema = new mongoose.Schema(
        {
                id: {
                        type: Number,
                        trim: true,
                        required: true
                },
                crash_point: {
                        type: Number
                },
                created: {
                        type: Date,
                },
                ended: {
                        type: Date,
                },
        },
        { collection: 'games' },
);

GameSchema.plugin(timestamps);

module.exports = exports = mongoose.model('Game', GameSchema);
