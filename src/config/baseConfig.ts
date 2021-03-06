
const env = process.env.NODE_ENV || 'development';

type configType = {
    uploadUrl: string;
}

type envType = {
    development : configType,
    production: configType,
}

const configList: envType = {
    development: {
        uploadUrl: 'https://banketlist-api.woolta.com',
    },
    production: {
        uploadUrl: 'https://banketlist-api.woolta.com',
    },
}

// @ts-ignore
const config: configType = configList[env];
export default config;
