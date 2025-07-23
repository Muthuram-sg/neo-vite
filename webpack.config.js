const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
  // ... other config above ...

  devtool: "source-map", // Source map generation must be turned on
  plugins: [
    new SentryWebpackPlugin({
      org: "saint-gobain-india",
      project: "neo-web-front-end",

      // Specify the directory containing build artifacts
      include: "./dist",

      // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
      // and needs the `project:releases` and `org:read` scopes
      authToken: import.meta.env.SENTRY_AUTH_TOKEN,

      // Optionally uncomment the line below to override automatic release name detection
      // release: import.meta.env.RELEASE,
    }),
  ],
};