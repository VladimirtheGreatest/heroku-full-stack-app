//route for index.ejs
const express = require('express')
const router = express.Router()
const Book = require('../models/book')   //using model of the book schema to display books

router.get('/', async (req, res) => {
  let books
  try {
    books =  await Book.find().sort({ createdAt : 'desc' }).limit(10).exec()  //top 10 recent book will show up, and sorted by date
  } catch {
    books = []
  }
  res.render('index', {books:books})
})

module.exports = router
