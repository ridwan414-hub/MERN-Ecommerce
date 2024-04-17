const multer = require('multer')
const {ALLOWED_FILE_TYPES, MAX_FILE_SIZE, UPLOAD_USERS_IMG_DIRECTORY, UPLOAD_PRODUCTS_IMG_DIRECTORY } = require('../config')


const userStorage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     console.log('file', file)
    //     cb(null, UPLOAD_USERS_IMG_DIRECTORY)
    // },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }

})
const productStorage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, UPLOAD_PRODUCTS_IMG_DIRECTORY)
    // },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }

})

const fileFilter = (req, file, cb) => {
    if(!ALLOWED_FILE_TYPES.includes(file.mimetype)){
        return cb(new Error('file type is not allowed'), false)
    }
    cb(null, true)
 }

const uploadProductImage = multer({
    storage: productStorage,
    limits: { fileSize: Number(MAX_FILE_SIZE) },
    fileFilter
})
const uploadUserImage = multer({
    storage: userStorage,
    limits: { fileSize: Number(MAX_FILE_SIZE) },
    fileFilter
})



module.exports = {uploadUserImage, uploadProductImage}