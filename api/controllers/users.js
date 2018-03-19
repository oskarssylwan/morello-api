// Imports
const webToken = require('jsonwebtoken');
const config = require('../../config');

// Model
const User = require('../../models/user');


// Exports
module.exports = {

  // Param Id Methods

  findUser: async (req, res, next, username) => {
    try {
      const user = await User.findOne({ username },  {password: 0, __v: 0});
      if (!user) throw new Error('User could not be found')
      req.user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  },


  // Router Methods
  getUser: (req, res, next) => res.json({
    success: true,
    message: 'User retrieved successfully!',
    user: req.user
  }),

  createUser: async (req, res, next) => {
    req.body.user_group = 'user';
    const user = new User(req.body);

    try {
      await user.save();
      res.json({
        success: true,
        message: 'User created successfully!',
        user: {
          email: user.email,
          username: user.username,
          user_group: user.user_group
        }
      });
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

      res.json({
        success: true,
        message: 'User updated successfully!',
        user: {
          email: updatedUser.email,
          username: updatedUser.username,
          user_group: updatedUser.user_group,
          cart: updatedUser.cart
        }

      });
    } catch (error) {
      return next(error);
    }
  },


  authenticateUser: function(req, res, next) {
    console.log(req.user);
    const userID = req.body.email || req.body.username;
    User.authenticate(userID, req.body.password, (error, user) => {
      if(error) {
        return next(error);
      } else {
        const payload = {
          username: user.username,
          user_id: user._id,
          user_group: user.user_group
        };

        const token = webToken.sign(payload, config.token_secret, {
          expiresIn: config.token_expire_time
        });

        res.json({
          success: true,
          message: "Authentication successfull!",
          token: token
        });
      }
    })
  },

  // authenticateUser: async (req, res, next) => {
  //   const userID = req.body.email || req.body.username;
  //
  // }
};
