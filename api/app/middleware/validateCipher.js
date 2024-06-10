const { cipher } = require('../utils')

module.exports = (schema) => {
	return (req, res, next) => {
		// Validate schema
		const { error } = schema.validate(req.body)

		// Check for error
		if (error)
			return res.status(400).send(error.details[0].message)

		next()
	}
}