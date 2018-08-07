'use strict'

const AWS = require('aws-sdk')

const s3 = new AWS.S3()

const fs = require('fs')

const mime = require('mime')

const path = require('path')

// allow us to use .env values
require('dotenv').load()

// pull in Upload model
const Upload = require('../app/models/upload')

const mongoose = require('mongoose')

mongoose.Promise = global.Promise // might change to another library

mongoose.connect('mongodb://localhost/node-s3-upload-express-development', {
  useMongoClient: true
})

const db = mongoose.connection

const file = {
  path: process.argv[2],
  name: process.argv[3]
}

const s3Upload = function (file) {
  const contentType = mime.getType(file.path)
  const ext = path.extname(file.path)
  const folder = new Date().toISOString().split('T')[0]
  const stream = fs.createReadStream(file.path)

  /* How to make the title be another command line arg?
     How can you verify your upload worked? Is it on S3?
  */

  const params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${folder}/${file.name}${ext}`,
    Body: stream,
    ContentType: contentType
  }

  return new Promise((resolve, reject) => {
    // call s3.upload with params and handle response with callback
    s3.upload(params, function (error, data) {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

db.once('open', () => {
  s3Upload(file)
    .then((s3Response) => {
      console.log('s3 Response is ', s3Response)
      return s3Response
    })
    .then((s3Response) => {
      return Upload.create({
        title: file.name,
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
// module.exports = s3Upload