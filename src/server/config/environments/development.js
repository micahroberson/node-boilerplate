const config = {
  PORT: process.env.PORT,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_DB: process.env.POSTGRES_DB,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  REDIS_URL: process.env.REDIS_URL,
  MANDRILL_API_KEY: process.env.MANDRILL_API_KEY,
  MANDRILL_SIGNING_DOMAIN: process.env.MANDRILL_SIGNING_DOMAIN,
  MANDRILL_FROM_EMAIL: process.env.MANDRILL_FROM_EMAIL,
  MANDRILL_FROM_NAME: process.env.MANDRILL_FROM_NAME
};

export default config;