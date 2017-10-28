'use strict';

const mongoose = require('mongoose');

// Schemas
const OrderSchema = new mongoose.Schema({
  made_by: {
    type: String,
    required: true,
    trim: true
  },
  items: {
    type: [{
      item_id: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }],
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});



// Models
const Order = mongoose.model('Order', OrderSchema);

// Exports
module.exports = Order;
