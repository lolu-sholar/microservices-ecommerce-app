const { config, middleware, router, db, rabbit, server } = require('./manager')

// Load configuration
config.sync()
// Middleware
middleware.sync()
// Database
db.connect()
// Set app router
router.sync()
// Start server
server.run()