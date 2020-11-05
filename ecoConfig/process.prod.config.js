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
      name: 'banketList-prod',
      // script path
      script: './node_modules/.bin/ts-node',
      args: './src/index.ts',
      // watch
      watch: false,
      env: {
        NODE_ENV: 'production',
        // port
        PORT: 4000,
        // debug environment variables
        DEBUG: 'test:banket-list:*',
        DEBUG_COLORS: true
      },
      instances: 2,
      // min uptime of the app to be considered started
      min_uptime: 5000,
      // number of consecutive unstable restarts (less than 1sec interval or custom time via min_uptime) before your app is considered errored and stop being restarted
      max_restarts: 5
    }
  ]
}
/* eslint-enable camelcase */
