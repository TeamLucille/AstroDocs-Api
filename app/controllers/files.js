'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models/file');
const File = models.file;

const multer  = require('multer');
const multerUpload = multer({ dest: 'files/' });

const s3Upload = require('lib/aws-s3-file-upload');

// const authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
  File.find()
    .then(files => res.json({ files }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  File.findById(req.params.id)
    .then(file => file ? res.json({ file }) : next())
    .catch(err => next(err));
};

const create = (req, res, next) => {
  // let File = Object.assign(req.body.file, {
  //   _owner: req.currentUser._id,
  // });
  // File.create(file)
  //   .then(file => res.json({ file }))
  //   .catch(err => next(err));

  s3Upload(req.file)
    .then((s3response) =>
      File.create({
        url: s3response.Location,
        title: req.body.image.title,
      }))
    .then((file) => res.json({ file }))
    .catch((err) => next(err));

  // res.json({ body: req.body, file: req.file });
};

const update = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  File.findOne(search)
    .then(file => {
      if (!file) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.
      return file.update(req.body.file)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  File.findOne(search)
    .then(file => {
      if (!file) {
        return next();
      }

      return file.remove()
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: multerUpload.single('image[file]'), only: ['create'] },

  // { method: authenticate, only: ['update', 'destroy'] },
], });