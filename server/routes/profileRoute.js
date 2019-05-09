'use strict';

const Profile = require('../models/profile.js');
const bodyParser = require('../lib/middleware/bodyParser.js');
const jsonParser = require('body-parser').json();
const bearerAuth = require('../lib/middleware/bearAuth.js');
const getProfileById = require('../lib/middleware/authMiddleware.js');
const profileRouter = module.exports = require('express').Router();

profileRouter.post('/postprofile', jsonParser, (req,res,next) => {

  try {
    let profile = new Profile(req.body);

    console.log('model', req.params);
    profile.save()
      .then( result => res.status(200).send(result))
      .catch(err => next(err));
  }
  catch(error){
    next(error.message);
  }
});

profileRouter.get('/profile/:model', (req,res,next) => {
  try {


    Profile.find({})
      .then( result => res.send(result))
      .catch(err => next(err));
  }
  catch(error){
    next(error.message);
  }
});

profileRouter.get('/profile/:id', (req,res,next) => {
  try {
    let id = req.params.id;
    Profile.findOne({_id: id})
      .then( result => res.send(result))
      .catch(err => next(err));
  }
  catch(error){
    next(error.message);
  }
});

profileRouter.put('/:id', bodyParser, (req,res,next) => {
  try{

    let id = req.params.id;

    console.log(id);
    Profile.findOne({_id:id})
      .then( result => {
        Object.assign(result, req.body);
        return result.save();
      })
      .then(result => res.send(result))
      .catch(err => next(err));
  }
  catch(error){
    next(error.message);
  }
});
