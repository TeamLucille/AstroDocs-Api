'use strict';

const mongoose = require('mongoose');
const uri = process.env.MONGOLAB_URI || 'mongodb://localhost/astroDoc-S3-file-express-development';
mongoose.Promise = global.Promise;
mongoose.connect(uri);

module.exports = mongoose;