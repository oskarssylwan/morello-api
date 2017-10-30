module.exports = {
  // Server setup
  port: 3000,

  //Databse setup
  db_location: 'mongodb://localhost:27017/morello',

  //Password hashing
  hash_rounds: 10,

  //Tokens
  token_secret: 'morello',
  token_expire_time: '1 day'
}
