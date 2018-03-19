
module.exports.makeCreateUser = Model => (username, email, password) =>
  Model.create({username, email, password})
   .catch( error => Promise.reject(error))


module.exports.makeUpdateUser = Model => (email, newData) =>
  Model.findOneAndUpdate({email}, newData, { new: true, fields: '-password'})
  .then(user => user ? user : Promise.reject(new Error('User could not be found')))
  .catch(error => Promise.reject(error));


module.exports.makeGetUser = Model => id =>
  Model.findOne({ $or: [{username: id}, {email: id}]}, '-password')
  .then(user => user ? user : Promise.reject(new Error('User could not be found')))
  .catch(error => Promise.reject(error));
