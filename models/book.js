//book schema, description, title pagecount etc all will be stored in the database, model for the book
const mongoose = require('mongoose')
const path = require('path')
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

bookSchema.virtual('coverImagePath').get(function(){    //this virtual schema is used to display cover of the book in index.ejs(books) which is uploaded by the user
  if (this.coverImageName != null){
    return path.join('/', coverImageBasePath, this.coverImageName)
  }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath    // exports to the server books.js so we can upload it and save it
