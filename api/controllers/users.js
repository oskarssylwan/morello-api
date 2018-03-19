// Imports
const webToken = require('jsonwebtoken');
const config = require('../../config');
const { response } = require('../../utility');

// Model
const User = require('../../models/user');


// Exports
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

  //eslint-disable-next-line
  getUser: (req, res, next) =>
    res.json(response('User retrieved successfully', {user: req.user})),

  createUser: async (req, res, next) => {
    req.body.user_group = 'user';
    const user = new User(req.body);

    try {
      await user.save();
      const { email, username, user_group } = user;

      res.json(response('User created successfully',
        {user: { email, username, user_group } }));

    } catch (error) {
      return next(error);
    }
  },

  updateUser: async (req, res, next) => {
    const { user } = req;

    try {
      if (req.token_decoded.username !== user.username) throw new Error('Access denied');

      user.set(req.body);
      const updatedUser = await user.save();
      const { email, username, user_group, cart } = updatedUser;

      res.json(response('User updated successfully!',
        {user: {email, username, user_group, cart } }));

    } catch (error) {
      return next(error);
    }
  },

  authenticateUser: async (req, res, next) => {
    const id = req.body.email || req.body.username;
    const password = req.body.password;

    try {
      const result = await User.authenticate(id, password);
      const { error, user } = result;
      if(error) throw error;
      
      const payload = {
        username: user.username,
        user_id: user._id,
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
