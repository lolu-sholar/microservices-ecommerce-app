// Define type
const NotificationType = Object.freeze({
  Email: 'email',
  Socket: 'socket',
  Push: 'push',
  All: 'all'
})

// Define category type
const NotificationCategoryType = Object.freeze({
  Login: 'login'
})

module.exports = {
  NotificationType,
  NotificationCategoryType
}