const mongoose = require('mongoose')   //author model, Name of the author this will be saved in the database and we can use it as an new Author check authors.js controller

const authorSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Author', authorSchema)
