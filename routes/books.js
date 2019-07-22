const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

//all Books, search for the books menu
router.get('/', async (req, res) => {
  let query = Book.find()   //searching for the model of the book
  if(req.query.title != null && req.query.title != ''){
    query = query.regex('title', new RegExp(req.query.title, 'i'))     //regular expression to find title of the book, executed if you click search books
  }
  if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
    query = query.lte('publishDate', req.query.publishedBefore)    // lte= less than or equal, query for the published date which will return object publishDate
  }
  if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
    query = query.gte('publishDate', req.query.publishedAfter)     // gte= greater than or equal, query for the published date which will return object publishDate
  }
  try {
    const books = await query.exec()
    res.render('books/index',{     // rendering content into index.ejs if successfull
      books:books,  //displays books covers check index.ejs
      searchOptions: req.query // check index.ejs used to display book queries, title, date, pagecount etc
    })
  } catch {
    res.redirect('/')
  }
})


//new Books
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})

//create Boooks

router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  saveCover(book, req.body.cover)
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

function saveCover(book, coverEncoded){
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)  //When receiving data from a web server, the data is always a string.Parse the data with JSON.parse(), and the data becomes a JavaScript object.
  if (cover != null && imageMimeTypes.includes(cover.type)){  // checking if file is jpg, png or gif "meet requirements"
    book.coverImage = new Buffer.from(cover.data, 'base64')  //base 64 encoding data, creating "buffer check models/book.js"
    book.coverImageType = cover.type
  }
}

module.exports = router
