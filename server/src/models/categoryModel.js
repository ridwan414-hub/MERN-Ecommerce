const { model } = require("mongoose")
const { Schema } = require("mongoose")

const categorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Category name is required'],
        unique: [true, 'Category name must be unique'],
        minlength:[3, 'Category name must be at least 3 characters'] 
    },
    slug: {
        type: String,
        required: [true, 'Category slug is required'],
        unique: true,
        lowercase: true,
    }
    
}, { timestamps: true })

const Category = model('Category', categorySchema)

module.exports = Category