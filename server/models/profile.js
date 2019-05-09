'use strict';

const mongoose = require('mongoose');


const profileSchema = new mongoose.Schema({
  firstname: {type: String, required: true, unique: false},
  lastname: {type: String, required: true, unique: false},
  companyname: {type: String, required: true, unique: false},
  _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
});

const Profile = module.exports = mongoose.model('Profile', profileSchema);
