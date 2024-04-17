require('dotenv').config()

const serverPort = process.env.SERVER_PORT || 3002
const mongodbURL = process.env.MONGODB_COMPASS_URI || 'mongodb://localhost:27017/MERN-Ecommerce-2024'

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || 'djjjjjjjjjjniueru4985547856'
const jwtAccessKey = process.env.JWT_ACCESS_KEY || 'niueru4985547856'
const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || 'niueru4986'
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || 'niueru49hgfhgvhvh86'


const smtpUsername = process.env.SMTP_USER_NAME || ''
const smtpPassword = process.env.SMTP_PASSWORD || ''
const clientUrl = process.env.CLIENT_URL || ''

const defaultUserImagePath = process.env.
DEFAULT_USER_IMAGE_PATH || '/server/public/images/users/default.png'
const defaultProductImagePath = process.env.DEFAULT_PRODUCT_IMAGE_PATH || '/server/public/images/products/default.png'

const UPLOAD_USERS_IMG_DIRECTORY = 'public/images/users'
const UPLOAD_PRODUCTS_IMG_DIRECTORY = 'public/images/products'
const MAX_FILE_SIZE = 2097152
const ALLOWED_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']




module.exports = {
    serverPort,
    mongodbURL,
    defaultUserImagePath,
    defaultProductImagePath,
    jwtActivationKey,
    jwtAccessKey,
    jwtRefreshKey,
    jwtResetPasswordKey,
    smtpUsername,
    smtpPassword,
    clientUrl,
    UPLOAD_USERS_IMG_DIRECTORY,
    UPLOAD_PRODUCTS_IMG_DIRECTORY,
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES
}

