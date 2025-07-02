/* eslint-disable camelcase */
module.exports = {

  /**
   * Application configuration section
   *
   * @see {@link http://pm2.keymetrics.io/docs/usage/application-declaration/}
   */
  apps: [
    {
      name: "woolbankApiServer",
      script: "./dist/src/index.js",
      // watch
      watch: false,
      env: {
        NODE_ENV: 'production',
        // port
        PORT: 4000,
      },
      max_memory_restart: 50,
      node_args: [
        '--max_old_space_size=50'
      ],
      instances: 1,
      // min uptime of the app to be considered started
      min_uptime: 5000,
      // number of consecutive unstable restarts (less than 1sec interval or custom time via min_uptime) before your app is considered errored and stop being restarted
      max_restarts: 5
    }
  ]
}
/* eslint-enable camelcase */
