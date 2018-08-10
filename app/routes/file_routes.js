// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for files
const File = require('../models/file')

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()
var multer  = require('multer')
// var multerS3 = require('multer-s3')

var upload = multer({ dest: 'uploads/'})
var aws = require('aws-sdk')
// var s3 = require('s3')
// var mime = require('mime')

// var s3 = new aws.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// })

const path = require('path')
const s3 = new aws.S3()

const s3Upload = file => {
  const fs = require('fs');
  const stream = fs.createReadStream(file);
  var mime = require('mime')


  const params = {
    ACL: "public-read",
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${new Date().toISOString().split("T")[0]}-${path.basename(stream.path)}`,
    Body: stream,
    // contentType: fileType.mime
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};



// function uploadToS3(file) {
// const fs = require("fs");
// const stream = fs.readFileSync(file);

//   let s3bucket = new aws.S3({
//     accessKeyId: IAM_USER_KEY,
//     secretAccessKey: IAM_USER_SECRET,
//     Bucket: BUCKET_NAME
//   });
//   s3bucket.createBucket(function () {
//       var params = {
//         ACL: "public-read",
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key:  file.title,
//         Body: file.body,
//         Type: mime.getType(stream)
//       };
//       s3bucket.upload(params, function (err, data) {
//         if (err) {
//           console.log('error in callback');
//           console.log(err);
//         }
//         console.log('success');
//         console.log(data);
//       });
//   });
// }
//Uploads
// var upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_S3_BUCKET_NAME,
//     metadata: function (req, file, cb) {
//       cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//       cb(null, Date.now().toString())
//     }
//   })
// })

// INDEX
// GET /files
router.get('/files', requireToken, (req, res) => {
  File.find()
    .then(files => {
      // `files` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return files.map(file => file.toObject())
    })
    // respond with status 200 and JSON of the files
    .then(files => res.status(200).json({ files: files }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW
// GET /files/5a7db6c74d55bc51bdf39793
router.get('/files/:id', requireToken, (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  File.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "file" JSON
    .then(file => res.status(200).json({ file: file.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// CREATE
// POST /files
router.post('/files', upload.single('file'),/*requireToken,*/ (req, res) => {
  // set owner of new file to be current user
  // req.body.file.owner = req.user.id
  var file = req.body.file.image

  s3Upload(file).then((data)=>{
    req.body.file.title=data.Title
    req.body.file=data 

    File.create(req.body.file.image)
    // respond to succesful `create` with status 201 and JSON of new "file"
    .then(file => {
      res.status(201).json({ file: file })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(err => handle(err, res))
  }).catch(console.error)
  // var stream = fs.createReadStream(file.path)
  console.log(req.body.file.image)
  console.log(req.body)
})

// UPDATE
// PATCH /files/5a7db6c74d55bc51bdf39793
router.patch('/files/:id', requireToken, (req, res) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.file.owner

  File.findById(req.params.id)
    .then(handle404)
    .then(file => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, file)

      // the client will often send empty strings for parameters that it does
      // not want to update. We delete any key/value pair where the value is
      // an empty string before updating
      Object.keys(req.body.file).forEach(key => {
        if (req.body.file[key] === '') {
          delete req.body.file[key]
        }
      })

      // pass the result of Mongoose's `.update` to the next `.then`
      return file.update(req.body.file)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// DESTROY
// DELETE /files/5a7db6c74d55bc51bdf39793
router.delete('/files/:id', requireToken, (req, res) => {
  File.findById(req.params.id)
    .then(handle404)
    .then(file => {
      // throw an error if current user doesn't own `file`
      requireOwnership(req, file)
      // delete the file ONLY IF the above didn't throw
      file.remove()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

module.exports = router
