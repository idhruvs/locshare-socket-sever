require('dotenv').config();

const devConfig  = {
}

const testConfig  = {
}

const prodConfig  = {
}

const defaultConfig = {
    PORT: process.env.PORT || 9000
}

function envConfig( env ) {
    switch( env ) {
        case 'development': 
            return devConfig;
        case 'test':
            return testConfig;
        default:
            return prodConfig;
    }
}

export default {
    ...defaultConfig,
    ...envConfig( process.env.NODE_ENV )
};