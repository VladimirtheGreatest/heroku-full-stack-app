//controller
const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')


//all authors searching for authors already added
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')   //regular expression, for example if you are looking for author James you only need to fill "J" to display
  }
  try {
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})


//new authors, creating new Author, Model author.js schema used here check models
router.get('/new', (req, res) => {
  res.render('authors/new', {    // new.ejs rendered from authors folder, simple form to create new author
    author: new Author()
  })
})

//create authors

router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  })
  try {
    const newAuthor = await author.save()
    res.redirect(`authors/${newAuthor.id}`)
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating Author'  //error if trying to create an author with empty field input
    })
  }
})

//show, edit, update, delete operations, need library method override in order to use put and delete from the browser


//show author and his books
router.get('/:id', async (req, res) => {
  try {
  const author = await Author.findById(req.params.id)
  const books = await Book.find({ author: author.id }).limit(6).exec()   //show only 6 books
  res.render('authors/show', {
    author: author,
    booksByAuthor: books
  })
} catch {
  res.redirect('/')
}
})


//edit authors
router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    res.render('authors/edit', {
      author: author
    })
  } catch {
    res.redirect('/authors')
  }
})

//update authors
router.put('/:id', async (req, res) => {
  let author  //we must define it outside of the scope try catch in order to use it
  try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name   //updaeting the author name, check author/formfields.js authorname is an input
    await author.save()
    res.redirect(`/authors/${author.id}`) //string interpolation
  } catch {
    if (author == null) {   //error if we cant find author in the database
      res.redirect('/')
    } else {
      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error updating Author'  //error if trying to update an author with empty field input
      })
    }
  }
})

//delete author
router.delete('/:id', async (req, res) => {
  let author
  try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors')
  } catch {
    if (author == null) {
      res.redirect('/')
    } else {
      res.redirect(`/authors/${author.id}`)
    }
  }
})


module.exports = router
