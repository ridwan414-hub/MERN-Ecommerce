const express = require('express');
const { seedUsers, seedProducts } = require('../controllers/seedController');
const { uploadUserImage, uploadProductImage } = require('../middlewares/uploadFile');
const seedRouter = express.Router();

seedRouter.get("/users",uploadUserImage.single('image') ,seedUsers)
seedRouter.get("/products",uploadProductImage.single('image'),seedProducts)

module.exports = seedRouter