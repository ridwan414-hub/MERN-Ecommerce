const { body } = require('express-validator')

const validateUserRegistrationInputs = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 31 })
        .withMessage("Name must be between 3 to 31 characters"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("invalid email address"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("address")
        .trim()
        .notEmpty()
        .withMessage("address is required"),
    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),
    body("image")
        .optional()
        .isString()
        .withMessage("user image is optional")

]
const validateUserLoginInputs = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("invalid email address"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

]
const validateUserUpdatePasswordInputs = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("invalid email address"),
    body("oldPassword")
        .trim()
        .notEmpty()
        .withMessage("Old Password is required"),
    body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("new Password is required")
        .isLength({ min: 6 })
        .withMessage("new Password must be at least 6 characters long"),
    body("confirmPassword")
        .trim()
        .notEmpty()
        .withMessage("confirm Password is required")

]
const validateUserForgotPasswordInputs = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("invalid email address"),
]
const validateUserResetPasswordInputs = [
    body("token")
        .trim()
        .notEmpty()
        .withMessage("Token is missing"),
    body("setPassword")
        .trim()
        .notEmpty()
        .withMessage("new Password is required")
        .isLength({ min: 6 })
        .withMessage("new Password must be at least 6 characters long"),
]
module.exports = { validateUserRegistrationInputs, validateUserLoginInputs, validateUserUpdatePasswordInputs, validateUserForgotPasswordInputs, validateUserResetPasswordInputs}