//controller
const express = require('express')
const router = express.Router()
const Author = require('../models/author')


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
    //res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`authors`)
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating Author'  //error if trying to create an author with empty field input
    })
  }
})

//show, edit, update, delete operations, need library method override in order to use put and delete from the browser

router.get('/:id', (req,res) => {
  res.send('Show Author' + req.params.id)
})


//edit authors
router.get('/:id/edit', async (req,res) => {
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
router.put('/:id', (req,res) => {
  res.send('Update Author' + req.params.id)
})

router.delete('/:id', (req,res) => {
  res.send('Delete Author' + req.params.id)
})


module.exports = router
