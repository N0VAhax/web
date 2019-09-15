var assert = require('assert');
var db = require('./database');
var request = require('request');
var config = require('../config/config');
var wallet = require('./wallet');

// Doesn't validate
module.exports = function(userId, satoshis, withdrawalAddress, withdrawalId, callback) {
    assert(typeof userId === 'number');
    assert(typeof withdrawalAddress === 'string');
    assert(typeof callback === 'function');

    db.makeWithdrawal(userId, satoshis, withdrawalAddress, withdrawalId, function (err, fundingId) {
        if (err) {
            if (err.code === '23514')
                callback('NOT_ENOUGH_MONEY');
            else if(err.code === '23505')
                callback('SAME_WITHDRAWAL_ID');
            else
                callback(err);
            return;
        }

        assert(fundingId);

        wallet.withdraw(userId, satoshis, withdrawalAddress, function(err, hash) {
            if (err) {
                if (err.message === 'Insufficient funds')
                    return callback('PENDING');
                return callback('FUNDING_QUEUED');
            }

            db.setFundingsWithdrawalTxid(fundingId, hash, function (err) {
                if (err)
                    return callback(new Error('Could not set fundingId ' + fundingId + ' to ' + hash + ': \n' + err));

                callback(null);
            });
        })
    });
};
