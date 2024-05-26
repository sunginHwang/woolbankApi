
const env = process.env.NODE_ENV || 'development';

type configType = {
    uploadUrl: string;
    clientUrl: string;
}

type envType = {
    development : configType,
    production: configType,
}

const configList: envType = {
    development: {
        uploadUrl: 'https://banketlist-api.woolta.com',
        clientUrl: 'http://bank-local.woolta.com:4200'
    },
    production: {
        uploadUrl: 'https://banketlist-api.woolta.com',
        clientUrl: 'https://bank.woolta.com'
    },
}

// @ts-ignore
const config: configType = configList[env];
export default config;
