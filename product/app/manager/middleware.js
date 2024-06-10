const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const SyntaxeIO = require('syntaxe-express')
const config = require('../manager/config')
const userContext = require('../middleware/userContext')

exports.sync = () => {
	// Get express app
	let app = config.getApp()

	// Middlewares
	app.use(compression())
	app.use(express.json())
	app.use(userContext)

	// Helmet
	if (process.env.STAGE=='prod')
		app.use(helmet())

	// Add syntaxe-express middleware
	SyntaxeIO.init({
		enabled: true,
		app
	})
}