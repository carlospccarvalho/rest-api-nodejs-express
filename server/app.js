const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

mongoose.Promise = global.Promise
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/template')

const app = express()
app.use(cors())

//Middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())


//Routes
app.use('/users', require('./routes/users'))
app.use('/categorias', require('./routes/categorias'))

module.exports = app
