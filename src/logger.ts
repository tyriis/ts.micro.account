const winston = require('winston');
export const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
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
  ],
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    trace: 4,
    debug: 5,
  },
  colors: {
    fatal: 'magenta',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    trace: 'cyan',
    debug: 'blue',
  },
});

process.on('uncaughtException', (ex) => {
  logger.error(ex);
});

export const pogiLogger = {
  log:(sql, params, connectionId) => (connectionId) ? logger.debug('[',connectionId,']', sql,' < ',params) : logger.debug(sql),
  error: logger.error
};
