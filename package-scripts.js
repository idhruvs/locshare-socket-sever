require('dotenv').config();

const npsUtils = require('nps-utils');

const { rimraf, crossEnv, series, concurrent } = npsUtils;

module.exports = {
    scripts: {
        build: {
            description: 'Building in production environment.',
            default: series.nps('clean', 'build.build'),
            build: 'webpack',
        },
        clean: {
            description: 'Clean dist folder.',
            default: rimraf('dist'),
        },
        default: {
            description: 'Start project with pm2 on production.',
            script: `${crossEnv('NODE_ENV=production')} pm2 start dist/index.bundle.js --name backend`,
        },
        dev: {
            start: {
                description: 'Running on dev environment.',
                script: `${crossEnv('NODE_ENV=development')} nodemon dist/index.bundle.js`,
            },
            default: {
                script: concurrent.nps('dev.watch', 'dev.start'),
            },
            watch: {
                description: 'Webpack watch for change and compile.',
                script: 'webpack -w',
            },
            withDebug: {
                script: `${crossEnv('NODE_ENV=development')} MONGOOSE_DEBUG=true DEBUG=express:* nodemon dist/index.bundle.js`,
            },
            debug: {
                description: 'Running on dev environment with debug on.',
                script: concurrent.nps('dev.watch', 'dev.withDebug'),
            }
        },
        lint: {
            default: 'eslint src',
            fix: 'eslint --fix src',
        },
        lintStaged: 'lint-staged',
        test: {
            // TESTING=true is required so that parse server does not catch any uncaught exception
            default: `${crossEnv('NODE_ENV=test TESTING=true')} mocha -R spec  --recursive --colors --compilers js:babel-register`,
            watch: series.nps('test -w'),
            cover: `${crossEnv('NODE_ENV=test')} istanbul cover _mocha $(find __tests__ -name *.test.js) -- --compilers js:babel-register --colors --bail --recursive '__tests__/**/*.test.js'`,
            checkCover: series('nps test.cover', 'istanbul check-coverage')
        },
        cover: {
            description: 'Open the coverage on browser.',
            default: 'open coverage/lcov-report/*.html',
        },
        validate: {
            description: 'Validate code by linting, type-checking.',
            default: series.nps('lint', 'test'),
        },
    },
};
