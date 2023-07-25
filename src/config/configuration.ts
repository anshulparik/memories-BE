export default () => ({
  token: {
    refresh_expiry: process.env.REFRESH_TOKEN_EXPIRY,
    refresh_secret: process.env.REFRESH_TOKEN_SECRET,
    access_expiry: process.env.ACCESS_TOKEN_EXPIRY,
    access_secret: process.env.ACCESS_TOKEN_SECRET,
  },

  database: {
    type: process.env.DATABASE_TYPE,
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    dbName: process.env.DATABASE_NAME,
  },
});
