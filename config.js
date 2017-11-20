module.exports = {
  // Server setup
  port: 8080,

  //Databse setup
  db_location: process.env.MONGODB_URI,
  payload_limit: '2000kb',

  //Password hashing
  hash_rounds: 10,

  //Tokens
  token_secret: 'morello',
  token_expire_time: '1 day'
}
