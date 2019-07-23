if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//dependencies
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override') //allows us to use put and delete, check authors.js


//routes
const indexRouter = require('./routes/index')    //access to the index.js file "router"
const authorRouter = require('./routes/authors')  //access to the authors.js file "router"
const bookRouter = require('./routes/books')  //access to the books.js file "router"


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))   //overriding post request method with delete, check authors/index.ejs
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended:false}))

//connection to the database

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)  //displayed in the link,  "route"
app.use('/authors', authorRouter)
app.use('/books', bookRouter)


app.listen(process.env.PORT || 3000)  ////Local host
