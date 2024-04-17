const { handleCreateCategory, handleGetCategories, handleGetCategoryBySlug, handleUpdateCategoryBySlug, handleDeleteCategoryBySlug } = require('../controllers/categoryController');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');
const { validateCategory } = require('../validators/categoryValidation');
const { runValidation } = require('../validators/runValidation');

const categoryRouter = require('express').Router();


categoryRouter.get("/",handleGetCategories)
categoryRouter.get("/:slug",handleGetCategoryBySlug)
categoryRouter.put("/:slug",validateCategory,runValidation, isLoggedIn, isAdmin, handleUpdateCategoryBySlug)
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteCategoryBySlug)

categoryRouter.post("/",validateCategory,runValidation,isLoggedIn,isAdmin,handleCreateCategory)

module.exports = categoryRouter;