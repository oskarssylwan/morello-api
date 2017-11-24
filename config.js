module.exports = {
  // Server setup
  port: process.env.PORT || 3000,

  //Databse setup
  db_location: process.env.MONGODB_URI,
  payload_limit: '2000kb',

  //Password hashing
  hash_rounds: process.env.HASH_ROUNDS || 10,

  //Tokens
  token_secret: process.env.TOKEN_SECRET || 'morello',
  token_expire_time: process.env.TOKEN_EXPIRE_TIME || '1 day'
}
