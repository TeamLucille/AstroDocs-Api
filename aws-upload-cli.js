'use strict';

var fs = require('fs');
var File = require('./models/file.js');

var buffer = fs.readFileSync(process.argv[2]);

var awsUpload = require('./lib/aws-s3-file-upload.js');

awsUpload(buffer, process.argv[3], function(err, data) {
  if (err) {
    throw err;
  }
  File.db.close();
  console.log(data);
});
