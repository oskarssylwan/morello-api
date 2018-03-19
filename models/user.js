const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config.js');

// Schemas
const UserSchema = new mongoose.Schema({
  email: {
    type:     String,
    unique:   true,
    required: true,
    trim:     true
  },
  username: {
    type:     String,
    unique:   true,
    required: true,
    trim:     true
  },
  password: {
    type:     String,
    required: true
  },
  user_group: {
    type:     String,
    default: 'user'
  },
  cart: {
    type: [{}],
    default: [{}]
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  }
});

//Static Methods
UserSchema.statics.authenticate = async (id, password) => {
  try {
    // eslint-disable-next-line
    const user = await User.findOne({ $or: [{username: id}, {email: id}]});
    if (!user) throw new Error('User not found');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) return { user };
    throw new Error('Credentials do not match');
  } catch (error) {
    return {error};
  }
};

// Cannot use arrow functions in this context
UserSchema.pre('save', async function(next) {
  let user = this;
  const { hash_rounds } = config;

  if (!user.password) return next();

  try {
    const hashedPassword = await bcrypt.hash(user.password, hash_rounds);
    user.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }

});

const User = mongoose.model('User', UserSchema);
module.exports = User;
