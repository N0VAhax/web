var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const FundingSchema = new mongoose.Schema(
        {
                uid: {
                        type: Number,
                        trim: true,
                        required: true
                },
                withdrawal_id: {
                        type: Number
                },
                amount: Number,
                withdrawal_address: String,
                funding_type: String,
                created: {
                        type: Date,
                }
        },
        { collection: 'fundings' },
);

FundingSchema.plugin(timestamps);

module.exports = exports = mongoose.model('Funding', FundingSchema);
