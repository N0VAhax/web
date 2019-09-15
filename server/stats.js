var database = require('./database');
var timeago = require('node-time-ago');
var config = require('../config/config');

var stats;
var generated;
var bankrollOffset = config.BANKROLL_OFFSET;

function getSiteStats() {
    database.getSiteStats(function(err, results) {
        if (err) {
            console.error('[INTERNAL_ERROR] Unable to get site stats: \n' + err);
            return;
        }

        stats = results;
        generated = new Date();
    });
}

setInterval(getSiteStats, 1000 * 60 * 20);
getSiteStats();

exports.index = function(req, res, next) {
    if (!stats) {
        return next('Stats are loading');
    }
    var user = req.user;

    stats.bankroll_offset = bankrollOffset;
    console.log("stats*************");
    console.log(stats);
    res.render('stats', { user: user, generated: timeago(generated), stats: stats });

};
