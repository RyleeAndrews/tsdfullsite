'use strict';

const Order = require('../models/orders.js');
const bodyParser = require('../lib/middleware/bodyParser.js');
const jsonParser = require('body-parser').json();
const ordersRouter = module.exports = require('express').Router();

ordersRouter.post('/postorder', bodyParser, ( req, res, next ) => {
  try {
    let order = new Order(req.body);

    console.log('model', req.params);
    order.save()
      .then( result => res.status(200).send(result))
      .catch(err => next(err));
  }
  catch(error){
    next(error.message);
  }
});

ordersRouter.get('/orders/:model', (req,res,next) => {
  try {


    Order.find({})
      .then( result => res.send(result))
      .catch(err => next(err));
  }
  catch(error){
    next(error.message);
  }
});

ordersRouter.get('/orders/:id', (req,res,next) => {
  try {
    let id = req.params.id;
    Order.findOne({_id: id})
      .then( result => res.send(result))
      .catch(err => next(err));
  }
  catch(error){
    next(error.message);
  }
});
