const config = require('./config')
const middleware = require('./middleware')
const router = require('../main/router')
const server = require('./server')
const db = require('../db')
const rabbit = require('../messaging')

module.exports = { config, middleware, db, rabbit, router, server }