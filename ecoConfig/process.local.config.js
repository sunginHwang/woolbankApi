
/* eslint-disable camelcase */
module.exports = {

  /**
   * Application configuration section
   *
   * @see {@link http://pm2.keymetrics.io/docs/usage/application-declaration/}
   */
  apps: [
    // front local server
    {
      // application name
      name: 'banketList-local',
      // script path
      script: './node_modules/.bin/ts-node',
      args: './src/index.ts',
      // watch
      watch: true,
      env: {
        NODE_ENV: 'development',
        // port
        PORT: 4000,
        // debug environment variables
        DEBUG: 'test:banket-list:*',
        DEBUG_COLORS: true
      }
    }
  ]
}
/* eslint-enable camelcase */
