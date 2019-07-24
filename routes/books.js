// books controller
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
    res.redirect(`books/${newBook.id}`)
  } catch {
      renderNewPage(res, book, true)    // error creating new book
  }
})


//show book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author').exec()  //in order to get information about author such as name etc not only id we need to use function populate
    res.render('books/show', { book:book })
  } catch {
    res.redirect('/')
  }
})


// Edit Book Route
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    renderEditPage(res, book)
  } catch {
    res.redirect('/')
  }
})

//update book

router.put('/:id', async (req, res) => {
  let book

  try {
    book = await Book.findById(req.params.id)
    book.title = req.body.title
    book.author = req.body.author
    book.publishDate = new Date(req.body.publishDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(book, req.body.cover)
    }
    await book.save()
    res.redirect(`/books/${book.id}`)
  } catch {
    if (book != null) {
      renderEditPage(res, book, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Book Page
router.delete('/:id', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect('/books')
  } catch {
    if (book != null) {
      res.render('books/show', {
        book: book,
        errorMessage: 'Could not remove book'
      })
    } else {
      res.redirect('/')
    }
  }
})

//function will render a new page if upload is successfull if not it will return error, it is used in both "create book" and "new book" logic
async function renderNewPage(res, book, hasError = false ){
  renderFormPage(res, book, 'new', hasError = false)
}

//function will render a edit page, used in edit book route above
async function renderEditPage(res, book, hasError = false ){
  renderFormPage(res, book, 'edit', hasError = false)
}

//renderFormPage code for both edit and new books, the only difference between them is form paramater which will be rendered after successful upload
async function renderFormPage(res, book, form, hasError = false ){
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Book'
      } else {
        params.errorMessage = 'Error Creating Book'
      }
    }
    res.render(`books/${form}`, params)
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
