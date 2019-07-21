const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Book = require('../models/book')
const uploadPath = path.join('public', Book.coverImageBasePath)   //coverImageBasePath comes from the model book.js
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})



//all Books
router.get('/', async (req, res) => {
  res.send('All books')
})


//new Books
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})

//create Boooks

router.post('/', upload.single('cover'), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description
  })
  try {
    const newBook = await book.save()  //add the book to the database + save the image to the folder
    //res.redirect(`books/${newBook.id}`)
    res.redirect(`books`)
  } catch {
      renderNewPage(res, book, true)    // error creating new book
  }
})

//function will render a new page if upload is successfull if not it will return error, it is used in both "create book" and "new book" logic
async function renderNewPage(res, book, hasError = false ){
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) params.errorMessage = 'Error creating new Book'
    res.render('books/new', params)
  } catch {
    res.redirect('/books')  //in case of an error redirecting back to the books section
  }
}



module.exports = router
