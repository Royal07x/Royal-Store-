const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};

export const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  MONGODB_URI: required('MONGODB_URI'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5500'
});
