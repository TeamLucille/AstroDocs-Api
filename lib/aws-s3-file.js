'use strict'

const AWS = require('aws-sdk')

const s3 = new AWS.S3()

const fs = require('fs')

const mime = require('mime')

const path = require('path')

// allow us to use .env values
require('dotenv').load()

// pull in Upload model
const File = require('../app/models/file')

const mongoose = require('mongoose')

mongoose.Promise = global.Promise // might change to another library

mongoose.connect('mongodb://localhost/astroDoc-S3-file-expres-development', {
  useMongoClient: true
})

const db = mongoose.connection

const astroFile = {
  path: process.argv[2],
  name: process.argv[3]
}

const s3File = function (astroFile) {
  const contentType = mime.getType(astroFile.path)
  const ext = path.extname(astroFile.path)
  const folder = new Date().toISOString().split('T')[0]
  const stream = fs.createReadStream(astroFile.path)

  /* How to make the title be another command line arg?
     How can you verify your upload worked? Is it on S3?
  */

  const params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${folder}/${astroFile.name}${ext}`,
    Body: stream,
    ContentType: contentType
  }

  return new Promise((resolve, reject) => {
    // call s3.file with params and handle response with callback
    s3.file(params, function (error, data) {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

db.once('open', () => {
  s3File(astroFile)
    .then((s3Response) => {
      console.log('s3 Response is ', s3Response)
      return s3Response
    })
    .then((s3Response) => {
      return File.create({
        title: astroFile.name,
        url: s3Response.Location
      })
    })
    .then(console.log)
    .catch((error) => {
      console.error(error)
    })
    .then(() => {
      db.close()
    })
})
module.exports = s3File