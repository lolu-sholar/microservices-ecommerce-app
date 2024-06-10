const { config, middleware, router, db, rabbit, server } = require('./manager')

// Load configuration
config.sync()
// Middleware
middleware.sync()
// Database
db.connect()
// Connect to rabbit server
rabbit.server.sync()
// Sync messages
rabbit.messages.sync()
// Set app router
router.sync()
// Start server
server.run()