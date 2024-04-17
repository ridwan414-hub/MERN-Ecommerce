const { handleCreateProduct, handleGetProducts, handleGetProductBySlug, handleDeleteProductBySlug, handleUpdateProductBySlug } = require('../controllers/productController');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');
const { uploadProductImage } = require('../middlewares/uploadFile');
const { validateProduct } = require('../validators/productValidation');
const { runValidation } = require('../validators/runValidation');


const productRouter = require('express').Router();

productRouter.post("/", uploadProductImage.single('image'),isLoggedIn,isAdmin,validateProduct,runValidation,handleCreateProduct)

productRouter.get("/", handleGetProducts)
productRouter.get("/:slug", handleGetProductBySlug)

productRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteProductBySlug)
productRouter.put("/:slug", uploadProductImage.single('image'), validateProduct, runValidation, isLoggedIn, isAdmin, handleUpdateProductBySlug)


module.exports = productRouter;