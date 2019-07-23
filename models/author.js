const mongoose = require('mongoose')   //author model, Name of the author this will be saved in the database and we can use it as an new Author check authors.js controller
const Book = require('./book')  //book.js in ther models

const authorSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  }
})

authorSchema.pre('remove', function(next) {
  Book.find({ author: this.id }, (err, books) => {
    if (err) {
      next(err)
    } else if (books.length > 0) {
      next(new Error('This author has books still'))
    } else {
      next()
    }
  })
})


module.exports = mongoose.model('Author', authorSchema)
