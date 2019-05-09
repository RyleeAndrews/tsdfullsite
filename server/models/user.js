'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bluebird').promisifyAll(require('bcrypt'));
const aws = require('../lib/middleware/s3.js');

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  _id: {type: mongoose.Schema.Types.ObjectId, auto: true},
});

userSchema.methods.attachFiles = function(files){

  let file = files[0];
  let key = `${file.filename}-${file.originalname}`;
  let record = this;

  aws.upload(file.path, key)
    .then( url => {
      record.avatar = url;
      return record.save();
    })
    .catch(console.error);
};

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashAsync(password, 10)
    .then((hash) => {
      this.password = hash;
      console.log(this);
      return this;
    });
};

userSchema.methods.genHash = function(password) {

  return new Promise( (resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return reject(err);
      }
      resolve(hash);
    });
  })
    .then(hash => {
      this.password = hash;
      return this;
    });
};

userSchema.methods.genHashCb = function(password, callback) {

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      callback(err);
    }

    this.password = hash;
    callback(null, this);
  });

};

userSchema.methods.comparePassword = function(password) {

  return bcrypt.compareAsync(password, this.password)
    .then(res => {

      if (res) {
        return this;
      }

      throw new Error('password did not match');
    });
};

userSchema.methods.generateToken = function() {

  let secret = process.env.SECRET;
  console.log('generating token', this)
  return jwt.sign({id: this._id}, secret);
};

module.exports = mongoose.model('User', userSchema);
