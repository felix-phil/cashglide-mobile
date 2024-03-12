require("dotenv/config");

const env = {
  API_URL: process.env.API_URL,
  SENTRY_DSN: process.env.SENTRY_DSN,
};
// const dev = {
//   API_URL: process.env.API_URL,
//   SENTRY_DSN: process.env.SENTRY_DSN,
// };
module.exports = {
  env: env,
  // dev: dev,
};
