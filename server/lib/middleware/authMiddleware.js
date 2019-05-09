'use strict';

const Profile = require('../../models/profile.js');

const getProfileById = module.exports = (req, res, next) => {
  Profile.findOne({_id: req.decodedId})
    .then(user => {
      if (!user) {
        return next({statusCode: 400, message: 'no user'});
      }
      console.log(user);
      req.user = user;
      next();
    })
    .catch(next);
};
