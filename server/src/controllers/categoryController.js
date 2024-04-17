const slugify = require('slugify')
const { successResponse } = require("./responseController")
const Category = require('../models/categoryModel')
const createHttpError = require('http-errors')

const handleCreateCategory = async (req, res, next) => {
    try {
        const { name } = req.body

        



        const newCategory = await Category.create({
            name: name,
            slug: slugify(name)
        })
        return successResponse(res, {
            statusCode: 201,
            message: 'category created',
            payload: newCategory
        })
    }
    catch (error) {
        next(error);
    }
}
const handleGetCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({}).select('name slug').lean()
        if (categories.length === 0) throw createHttpError(404, 'no categories found')
        return successResponse(res, {
            statusCode: 200,
            message: 'categories fetched',
            payload: { categories }
        })
    }
    catch (error) {
        next(error);
    }
}
const handleGetCategoryBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params
        const category = await Category.find({ slug }).select('name slug').lean()
        if (!category) throw createHttpError(404, 'category not found with this slug')
        return successResponse(res, {
            statusCode: 200,
            message: 'category fetched',
            payload: { category }
        })
    }
    catch (error) {
        next(error);

    }
}
const handleUpdateCategoryBySlug = async (req, res, next) => {
    try {
        const { name } = req.body
        const { slug } = req.params
        const updatedCategory = await Category.findOneAndUpdate(
            { slug },
            { $set: { name: name, slug: slugify(name) } },
            { new: true })
        if (!updatedCategory) throw createHttpError(404, 'category not found')
        return successResponse(res, {
            statusCode: 200,
            message: 'category updated',
            payload: updatedCategory
        })
    }
    catch (error) {
        next(error);
    }
}
const handleDeleteCategoryBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params
        const deletedCategory = await Category.findOneAndDelete({ slug })
        console.log(deletedCategory)
        if (!deletedCategory) throw createHttpError(404, 'category not found')
        else return successResponse(res,
            {
                statusCode: 200,
                message: 'category deleted'
            })
    }
    catch (error) {
        next(error);
    }
}
module.exports = { handleCreateCategory, handleGetCategories, handleGetCategoryBySlug, handleUpdateCategoryBySlug, handleDeleteCategoryBySlug }