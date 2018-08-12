const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: false
  }
}

// {
//   timestamps: true
// }
)
module.exports = mongoose.model('File', fileSchema)
