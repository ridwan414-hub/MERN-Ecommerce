const createHttpError = require("http-errors")
const Product = require("../models/productModel")
const { default: slugify } = require("slugify")
const { successResponse } = require("./responseController")
const deleteImage = require("../helper/deleteImage")
const cloudinary = require("../Config/cloudinary")
const { deleteImageFromCloudinary } = require("../helper/cloudinaryHelper")

const handleCreateProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.body

        const image = req.file?.path

        if (req.file && req.file.size > 2 * 1024 * 1024) throw createError(400, 'file is too large')

        const productExists = await Product.exists({ name })
        if (productExists) throw createHttpError(409, 'Product already exists')

        const productData = { name, slug: slugify(name), description, price, category, quantity, shipping }
        if (image) {
            const response = await cloudinary.uploader
                .upload(image, { folder: 'ecommerceMern/products' })
            productData.image = response.secure_url
        }

        const newProduct = await Product.create(productData)
        return successResponse(res, {
            statusCode: 200,
            message: 'product created',
            payload: newProduct
        })
    }
    catch (error) {
        next(error);
    }
}
const handleGetProducts = async (req, res, next) => {
    try {
        const search = req.query.search || ''
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 4

        const searchRegExp = new RegExp('.*' + search + '.*', 'i')
        const filter = { $or: [{ name: { $regex: searchRegExp } }] }

        const products = await Product.find(filter).populate('category').limit(limit).skip((page - 1) * limit).sort({ createdAt: -1 })
        if (!products) throw createHttpError(404, 'Products not found')

        const count = await Product.find(filter).countDocuments()


        return successResponse(res, {
            statusCode: 200,
            message: 'products fetched',
            payload: {
                products: products,
                pagination: {
                    totalProducts: count,
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page > 1 ? page - 1 : null,
                    nextPage: page < Math.ceil(count / limit) ? page + 1 : null
                }
            }
        })
    }
    catch (error) {
        next(error);
    }
}
const handleGetProductBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params
        const product = await Product.findOne({ slug }).populate('category')
        if (!product) throw createHttpError(404, 'Product not found')
        return successResponse(res, {
            statusCode: 200,
            message: 'product fetched',
            payload: product
        })
    }
    catch (error) {
        next(error);
    }
}
const handleDeleteProductBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params
        const product = await Product.findOne({ slug })
        if (!product) throw createHttpError(404, 'Product not found')
        if (product.image) {
            deleteImageFromCloudinary(product.image, 'products')
        }
        await Product.findOneAndDelete({ slug })

        return successResponse(res, {
            statusCode: 200,
            message: 'product deleted'
        })
    }
    catch (error) {
        next(error);
    }
}
const handleUpdateProductBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params
        const { name, description, price, category, quantity, shipping } = req.body


        const product = await Product.findOne({ slug })
        if (!product) throw createHttpError(404, 'Product not found')

        const productData = { name, slug: slugify(name), description, price, category, quantity, shipping }

        const image = req.file?.path
        if (req.file && req.file.size > 2 * 1024 * 1024) throw createError(400, 'file is too large')
        
        if (image) {try {
            
                const response = await cloudinary.uploader
                    .upload(image, { folder: 'ecommerceMern/products' })
                productData.image = response.secure_url
        } catch (error) {
            throw createHttpError(500, 'Failed to upload image in cloudinary')
        }
        }

        const updatedProduct = await Product.findOneAndUpdate({ slug }, productData, { new: true })

        if (!updatedProduct) throw createHttpError(404, "Updating product is not possible")
        
        if (product.image) {
            await deleteImageFromCloudinary(product.image, 'products')
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'product updated',
            payload: updatedProduct
        })
    }
    catch (error) {
        next(error);
    }

}

module.exports = { handleCreateProduct, handleGetProducts, handleGetProductBySlug, handleDeleteProductBySlug, handleUpdateProductBySlug }