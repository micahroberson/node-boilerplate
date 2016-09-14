const env = process.env.NODE_ENV;
const config = require(`./environments/${env}`).default;
export default config;