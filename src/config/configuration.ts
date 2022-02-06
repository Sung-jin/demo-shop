export default () => ({
  type: process.env.DB_TYPE,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    privateKey: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  encryption: {
    secretKey: process.env.ENCRYPTION_SECRET_KEY,
    secretKeyLength: parseInt(process.env.ENCRYPTION_SECRET_KEY_LENGTH),
    algorithm: process.env.ENCRYPTION_ALGORITHM,
    hashSaltRound: parseInt(process.env.ENCRYPTION_HASH_SALT_ROUND),
  }
});
