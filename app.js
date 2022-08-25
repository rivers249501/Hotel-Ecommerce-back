const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const cors = require('cors');
const path = require('path')

//controllers
const { globalErrorHandler } = require('./controllers/error.controller')

//Routes
const { usersRouter } = require('./routes/users.routes');
const { hotelRouter } = require('./routes/hotels.routes');
const { cartsRouter } = require('./routes/carts.routes');
const { checkboxesRouter } = require('./routes/checkboxes.routes');


//util
const { AppError } = require('./util/AppError')
// const { Checkboxes } = require('./models/checkboxes.model')

//init server
const app = express()
//import json
app.use(express.json())

//max request/min = 5
app.use(rateLimit({ windowMS: 60*1000, max: 5, message: 'Too many request from your IP address, please verify' }))

//Enable helmet
app.use(helmet())

//Enable compression response for the browser 
app.use(compression())

//Enable morgan to view the request in console 
app.use(morgan('dev'))

//Enable cors
app.use('*', cors());

//Endpoints
app.use('/api/v1/docs', express.static(__dirname + '/docs'))
app.use('/api/v1/user', usersRouter)
app.use('/api/v1/hotel', hotelRouter);
app.use('/api/v1/carts', cartsRouter);
app.use('/api/v1/checkboxes', checkboxesRouter);



app.use('*', (req, res, next) => {
    next(new AppError(404, "not found this server."))
})

//error Handler (err -> AppError)
app.use(globalErrorHandler)

module.exports = { app }
