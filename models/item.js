'use strict';

const mongoose = require('mongoose');

// Schemas
const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: {type: String, default: 'Lorem Ipsum Description'},
  origin: {type: String, default: 'USA'},
  material: {type: String, default: 'Cotton'},
  color: String,
  categories: [String],
  image: String
});


// Models
const Item = mongoose.model('Item', ItemSchema);

// Exports
module.exports = Item;
