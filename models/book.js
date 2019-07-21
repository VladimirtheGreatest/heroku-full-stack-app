//book schema, description, ittle pagecount etc all stored in the database
const mongoose = require('mongoose')

const coverImageBasePath = 'uploads/bookCovers'   //path to all stored book cover images it will be created by multer

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  publishDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImageName: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, //Author.js referencing
    required: true,
    ref: 'Author'
  }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath    // exports to the server books.js so we can upload it and save it
