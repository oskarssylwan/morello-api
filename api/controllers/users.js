const webToken = require('jsonwebtoken');
const config = require('../../config');
const { response } = require('../../utility');
const User = require('../../mongodb/models/user');
const { makeCreateUser, makeUpdateUser, makeGetUser, makeAuthenticateUser } = require('../../mongodb/utils');
const { makeCreateToken } = require('../../utility');

const createUser = makeCreateUser(User);
const updateUser = makeUpdateUser(User);
const getUser = makeGetUser(User);
const authenticateUser = makeAuthenticateUser(User);

const createToken = makeCreateToken(webToken)
  ({secret: config.tokenSecret, expireTime: '1 day'});


module.exports = {

  // Param Id Methods
  findUser: (req, res, next, username) => {
    getUser(username)
    .then(user => { req.user = user; next();})
    .catch(next)
  },

  //eslint-disable-next-line
  getUser: (req, res, next) =>
    res.json(response('User retrieved successfully', {user: req.user})),


  createUser: (req, res, next) => {
    const { email, username, password } = req.body;
    createUser(username, email, password)
    .then( user => res.json(response('User created successfully', {user: { email, username} })))
    .catch(next);
  },


  updateUser: (req, res, next) => {
    updateUser(req.token.email, req.body.update)
    .then( user => res.json(response('User updated successfully', {user})))
    .catch(next);
  },

  authenticateUser: (req, res, next) => {
    const { password, email } = req.body;
    authenticateUser(email, password)
    .then( user => res.json(response('Authentication successfull!',
      { token: createToken({
          email: user.email,
          user_group: user.user_group
      })})))
    .catch(next);
  }
};
