'use strict';

const jsonParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://RyleeAW:hhwwww1@ds131971.mlab.com:31971/totalscreen');
require('./lib/server.js').start();
