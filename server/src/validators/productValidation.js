const { body } = require("express-validator")

const validateProduct = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ min: 3 })
        .withMessage("Product name must be at least 3 characters"),
    body("price")
        .trim()
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a number"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 3, max: 1000 })
        .withMessage("Description must be between 3 to 1000 characters"),
    body("quantity")
        .trim()
        .notEmpty()
        .withMessage("Quantity is required")
        .isNumeric()
        .withMessage("Quantity must be a number"),
    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),
    body("image")
        .optional()
        .isString()
        .withMessage("Product image is optional")
]

module.exports = { validateProduct }