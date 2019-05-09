'use strict';

const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
  sizes: {type: String, required: false},
  individual: {type: String, required: true},
  company: {type: String, required: false},
  address: {type: String, required: true},
  contact: {type: String, required: true},
  email: {type: String, required: true},
  style: {type: Number, required: true},
  supplier: {type: String, required: true},
  quantity: {type: Number, required: false},
  color: {type: String, required: false},
  placement: {type: String, required: true},
  inkColor: {type: String, required: true},
  _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
});

const Order = module.exports = mongoose.model('Order', ordersSchema);
