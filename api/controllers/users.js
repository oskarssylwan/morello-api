const webToken = require('jsonwebtoken');
const config = require('../../config');
const { response } = require('../../utility');
const User = require('../../models/user');
const { makeCreateUser, makeUpdateUser } = require('../../mongodb/utils');

const createUser = makeCreateUser(User);
const updateUser = makeUpdateUser(User);
const getUser = makeUpdateUser(User);

module.exports = {

  // Param Id Methods
  findUser: async (req, res, next, username) => {
    try {
      const user = await User.findOne({ username },  {password: 0, __v: 0});
      if (!user) throw new Error('User could not be found');
      req.user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  },

  // findUser: async (req, res, next, username) => {
  //   try {
  //     req.user = await getUser(username);
  //   } catch (error) {
  //     return next(error);
  //   }
  //   return getUser(username)
  //   .then(user => req.user)
  //   .then(next())
  //   .catch(next)
  // },

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

  authenticateUser: async (req, res, next) => {
    const id = req.body.email || req.body.username;
    const password = req.body.password;

    try {
      const result = await User.authenticate(id, password);
      const { error, user } = result;
      if(error) throw error;
      const payload = {
        email: user.email,
        user_group: user.user_group
      };

      const { token_secret, token_expire_time } = config;
      const token = webToken.sign(payload, token_secret, { expiresIn: token_expire_time });
      res.json(response('Authentication successfull!', { token }));

    } catch (error) {
      next(error);
    }

  }
};
