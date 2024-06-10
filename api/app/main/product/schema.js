const Joi = require('@hapi/joi')

exports.createProduct = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  category: Joi.string().required(),
  quantity: Joi.string().required(),
  price: Joi.string().required(),
  photos: Joi.array().items(Joi.string().required()).required()
})

exports.updateProduct = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string(),
  category: Joi.string().required(),
  photos: Joi.array().items(Joi.string().required()).required()
})

exports.updateProductDetail = Joi.object({
  id: Joi.string().required(),
  value: Joi.string().required()
})