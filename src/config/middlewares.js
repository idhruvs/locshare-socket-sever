/**
 * Configuration of the server middlewares.
 */

import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import expressWinston from 'express-winston';
import methodOverride from 'method-override';
import helmet from 'helmet';
import cors from 'cors';
import expressStatusMonitor from 'express-status-monitor';

import winstonInstance from './winston';

const minimizeLogs = true;
const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export default app => {
    app.use(compression());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(helmet());
    app.use(cors());
    app.use(expressStatusMonitor());
    app.use(methodOverride());
    if (isDev && !isTest) {
        app.use(morgan('dev'));
        if (!minimizeLogs) {
            expressWinston.requestWhitelist.push('body');
            expressWinston.responseWhitelist.push('body');
        }
        app.use(
            expressWinston.logger({
                winstonInstance,
                meta: !minimizeLogs,
                msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
                colorStatus: true,
            })
        );
    }
    if (isProd) {
        app.use(morgan('combined'));
        app.use(
            expressWinston.logger({
                winstonInstance,
                meta: true,
                msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms'
            }),
        );
    }
};
