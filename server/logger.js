const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const logDir = './log';

if (!fs.existsSync(`${logDir}`)) {
  fs.mkdirSync(`${logDir}`);
}

const tsFormat = () => (new Date()).toLocaleTimeString();

var logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      timestamp: tsFormat,
      colorize: true,
      level: 'debug'
    }),
    new winston.transports.DailyRotateFile({
      filename: `${logDir}/%DATE%-info.log`,
      timestamp: tsFormat,
      datePattern: 'YYYY-MM-dd',
      prepend: true,
      level: 'info'
    })
  ],
  exitOnError: false
});


module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
