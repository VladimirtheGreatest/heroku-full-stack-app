//book schema, description, title pagecount etc all will be stored in the database, model for the book
const mongoose = require('mongoose')


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
  coverImage: {
    type: Buffer,     //no longer string since we used filepond, buffer of the data representing the entire image
    required: true
  },
  coverImageType: {
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
  if (this.coverImage != null && this.coverImageType != null){                     //The function is never activated. That function always exists, and all it does is try to convert the cover image database information into a usable cover image. The function won't return anything though unless the cover image information is set on the database object.
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`  //converting into base64 data
  }
})

module.exports = mongoose.model('Book', bookSchema)
