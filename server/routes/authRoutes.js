
'use strict';

const User = require('../models/user.js');
const basicHTTP = require('../lib/middleware/basicHttp.js');
const bearerAuth = require('../lib/middleware/bearAuth.js');
const jsonParser = require('body-parser').json();
const bodyParser = require('../lib/middleware/bodyParser.js');
const jwt = require('jsonwebtoken');
const authRouter = module.exports = require('express').Router();

authRouter.post('/auth/create', jsonParser, (req, res, next) => {
  const password = req.body.password;

  delete req.body.password;

  let newUser = new User(req.body);
  console.log('heeeeey', newUser);
  newUser.generateHash(password)
    .then((user) => {
      user.save()
        .then( user => {
          console.log('user', newUser);
          let token = user.generateToken();
          res.cookie('auth', token);
          res.send({user,token});
        })
        .catch(error => next(error.message));
    })
    .catch(next);

});

authRouter.get('/auth/login', basicHTTP, (req, res, next) => {

  User.findOne({username: req.auth.username})

    .then(user => {

      if (!user) {
        next({statusCode: 403, message: 'Invalid Username'});
      }
      console.log(User._id);
      user.comparePassword(req.auth.password)
        .then( user => {
          let token = user.generateToken();
          res.cookie('auth', token, { maxAge: 900000 });
          res.send({user,token});
        })
        .catch( err =>
          next({statusCode: 403, message: 'Invalid Credentials'})
        );

    })
    .catch(next);
});

authRouter.get('/auth/validate', bearerAuth, (req, res, next) => {
  User.findOne({_id: req.userId})
    .then(user => {
      console.log('made it')
      if(!user){
        throw new Error('user not found');
      }
      let token = user.generateToken();
      res.cookie('auth', token, { maxAge: 900000 });
      res.send({user,token});
    })
    .catch(next);
});

authRouter.put('/auth/:id', jsonParser, bearerAuth, (req,res,next) => {
  let id = req.params.id;

  console.log('hit',req.params.id);

  User.findOne({_id:id})
    .then( result => {
      Object.assign(result, req.body);
      return result.save();
    })
    .then( record => {
      console.log('record', record);
      if(req.files && req.files.length){
        return record.attachFiles(req.files);
      }
    })
    .then(result => {
      console.log(result)
      res.send(result);
    })
    .catch(err => next(err.message));
});

authRouter.delete('/auth/:id', bearerAuth, (req,res,next) => {
  try{

    let id = req.params.id;

    User.remove({_id:id})
      .then( () => res.send('model deleted'))
      .catch(err => res.send('model id not found'));
  }
  catch(error){
    next(error.message);
  }
});
