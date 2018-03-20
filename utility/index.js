module.exports.response = require('./response');

module.exports.makeCreateToken = jsonwebtoken => config => payload =>
  jsonwebtoken.sign(payload, config.secret, { expiresIn: config.expireTime})
