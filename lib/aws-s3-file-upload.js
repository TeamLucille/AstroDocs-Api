'use strict';

var util = require('util');
var fs = require('fs');
var path = require('path');
var File = require('./models/file.js');

var crypto = require('crypto');
var getFileType = require('file-type');

var uploadBaseUrl = function (req) {
  return 'http://localhost:4741/files';
};

var fileUpload = function(title, buffer, callback) {
  var dirName = (new Date()).toISOString().split('T')[0];
  var fileType = getFileType(buffer);
  var fileExt = fileType ? fileType.ext : 'bin';
  var filename = util.format('%s.%s',
    crypto.pseudoRandomBytes(16).toString('hex'),
    fileExt);
  var uploadDir = util.format('%s/%s',
    path.join(__dirname, '..', 'public', 'files'),
    dirName);
  var uploadFullPath = util.format('%s/%s',
    uploadDir, filename);
  var url = util.format('%s/%s/%s',
    uploadBaseUrl(), dirName, filename);

  fs.mkdir(uploadDir, function(err) {
    if (err && err.code !== 'EEXIST') {
      callback(err);
      return;
    }
    fs.writeFile(uploadFullPath, buffer, function(err) {
      if (err) {
        callback(err);
        return;
      }
      File.create({
        title: title,
        url: url
      }, callback);
    });
  });
};

module.exports = fileUpload;