
import winston from 'winston';

const logger = new winston.Logger({
	transports: [
		new winston.transports.Console({
			json: true,
			colorize: true,
		}),
		new winston.transports.File({
			filename: 'logs/errors.log',
			level: 'info'
		})
	],
	exceptionHandlers: [
		new winston.transports.File({ filename: '../logs/exceptions.log' })
	]
});

export default logger;
