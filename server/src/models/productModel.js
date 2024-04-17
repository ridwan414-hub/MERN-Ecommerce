const { Schema, model } = require("mongoose");
const { defaultProductImagePath } = require("../config");

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        minLength: [3, 'Product name cannot be less than 3 characters'],
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    slug: {
        type: String,
        required: [true, 'Please enter product slug'],
        lowercase: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Please enter product description'],
        maxLength: [1000, 'Product description cannot exceed 1000 characters'],
        minLength: [3, 'Product description cannot be less than 3 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        default: 0.0,
        trim: true,
        validate: {
            validator: v => v > 0,
            message: props => `${props.value} is not a valid price!`
        }

    },
    quantity: {
        type: Number,
        required: [true, 'Please enter product quantity'],
        default: 0,
        trim: true,
        validate: {
            validator: v => v > 0,
            message: props => `${props.value} is not a valid Quantity!`
        }
    },
    sold: {
        type: Number,
        required: [true, 'Please enter product sold'],
        default: 0,
        trim: true
    },
    shipping: {
        type: String,
        default: 'free',
    }, 
    image: {
        type: String,
        default: defaultProductImagePath
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please select product category']
    },
})

const Product = model('Product', productSchema)
module.exports = Product