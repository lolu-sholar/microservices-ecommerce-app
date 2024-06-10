// Define type
const NotificationType = Object.freeze({
  Email: 'email',
  Socket: 'socket',
  Push: 'push',
  All: 'all'
})

// Define category type
const NotificationCategoryType = Object.freeze({
  CreateProduct: 'createProduct',
  UpdateProduct: 'updateProduct',
  UpdateProductQuantity: 'updateProductQuantity',
  UpdateProductPrice: 'updateProductPrice',
  RemoveProduct: 'removeProduct',
})

module.exports = {
  NotificationType,
  NotificationCategoryType
}