const winston = require('winston');

export const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'info',
            colorize: true,
        }),
        new (winston.transports.File)({
            name: 'error-file',
            level: 'error',
            filename: 'log/error.log'
        }),
        new (winston.transports.File)({
            name: 'debug-file',
            level: 'debug',
            filename: 'log/debug.log'
        })
    ]
});


process.on('uncaughtException', (ex) => {
    logger.error(ex);
    logger.error('test');
});
