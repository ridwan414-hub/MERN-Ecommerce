const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const emailWithNodeMailer = require("../helper/mail");
const { successResponse } = require("./responseController");
const createError = require("http-errors");
const { findingById } = require("../services/findItem");
const createJWT = require("../helper/JWT");
const { jwtActivationKey, clientUrl, jwtResetPasswordKey } = require("../config");
const deleteImage = require("../helper/deleteImage");
const cloudinary = require("../Config/cloudinary");
const { deleteImageFromCloudinary } = require("../helper/cloudinaryHelper");


const getUsers = async (req, res, next) => {
    try {
        const search = req.query.search || ""
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5

        const searchRegExp = new RegExp('.*' + search + '.*', 'i')
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } },
            ]
        }
        const options = { password: 0 }

        const users = await User.find(filter, options).limit(limit).skip((page - 1) * limit)
        const count = await User.find(filter).countDocuments()

        if (users.length === 0) throw createError(403, "no user found")


        return successResponse(res, {
            statusCode: 200,
            message: "all users returned",
            payload: {
                users: users,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
                }
            }
        })
    } catch (error) {
        next(error);
    }
}
const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id
        const options = { password: 0 }
        const user = await findingById(User, id, options)
        return successResponse(res, {
            statusCode: 200,
            message: "user returned successfully",
            payload: { user }
        })
    } catch (error) {
        next(error);
    }
}
const deleteUserById = async (req, res, next) => {
    try {
        const id = req.params.id
        const options = { password: 0 }
        const user = await findingById(User, id, options)

        if (user && user.image) {
            deleteImageFromCloudinary(user.image, 'Users')
        }

        await User.findByIdAndDelete({ _id: id, isAdmin: false })

        return successResponse(res, {
            statusCode: 200,
            message: "user was deleted successfully",
        })
    } catch (error) {
        next(error);
    }

}
const proccessRegister = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body
        const image = req.file?.path
        if (image && image.size > 2 * 1024 * 1024) throw createError(400, 'file is too large')

        const userExists = await User.exists({ email: email })
        if (userExists) throw createError(409, 'User with this email already exists.Please sign in')

        const tokenPayload = { name, email, password, phone, address }
        if (image) tokenPayload.image = image
        const token = createJWT(tokenPayload, jwtActivationKey, '10m')

        const emailData = {
            email,
            subject: 'Account Activation Mail',
            html: `<h2>Hello ${name}</h2>
            <p>Please click here to <a href="${clientUrl}/api/users/activate/${token}" target="_blanck">activate your account</a></p>
            `
        }
        try { await emailWithNodeMailer(emailData) }
        catch (emailError) {
            next(createError(500, 'Failed to send verification email'))
            return
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Please check your ${email} to activate your account`,
            payload: token
        })
    } catch (error) {
        next(error);
    }
}
const activateUserAccount = async (req, res, next) => {
    try {
        const token = req.body.token
        if (!token) throw createError(404, 'token not found')

        try {
            const decoded = jwt.verify(token, jwtActivationKey)
            if (!decoded) throw createError(401, 'unable to verify user')

            const userExists = await User.exists({ email: decoded.email })
            if (userExists) throw createError(409, 'User with this email already exists.Please sign in')

            const image = decoded.image
            if (image) {
                const response = await cloudinary.uploader
                    .upload(image, { folder: 'ecommerceMern/users' })
                decoded.image = response.secure_url
            }

            await User.create(decoded)
            return successResponse(res, {
                statusCode: 201,
                message: 'user account activated successfully',
            })

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw createError(401, 'token expired')
            } else if (error.name === 'JsonWebTokenError') {
                throw createError(401, 'invalid token')
            } else {
                throw error
            }
        }
    } catch (error) {
        next(error);
    }
}
const updateUserById = async (req, res, next) => {
    try {
        const userid = req.params.id
        const options = { password: 0 }

        const user = await findingById(User, userid, options)
        if (!user) throw createError(404, 'user not found')

        const updateOptions = { new: true, runValidators: true, contxt: 'query' }
        const newUpdates = {}

        const allowedFields = ['name', 'password', 'phone', 'address']
        for (const key in req.body) {
            if (allowedFields.includes(key)) {
                newUpdates[key] = req.body[key]
            } else if (key === 'email') {
                throw createError(400, 'email cannot be updated')
            }
        }

        const image = req.file?.path
        console.log(image)
        if (image) {
            if (image.size > 2 * 1024 * 1024) throw createError(400, 'file is too large')
            const response = await cloudinary.uploader
                .upload(image, { folder: 'ecommerceMern/users' })
            console.log(response)
            newUpdates.image = response.secure_url
        }

        const updatedUser = await User.findByIdAndUpdate(userid, newUpdates, updateOptions).select('-password')
        if (!updatedUser) throw createError(404, 'user update is not possible')
        if (user.image) {
           await deleteImageFromCloudinary(user.image, 'users')
        }
        return successResponse(res, {
            statusCode: 200,
            message: "user was updated successfully",
            payload: { updatedUser }
        })
    } catch (error) {
        next(error);
    }

}
const handleManageUserById = async (req, res, next) => {
    try {
        const userid = req.params.id
        const action = req.body.action
        let update
        if (action === 'ban') {
            update = { isBanned: true }
            successMessage = "User was banned successfully"
        } else if (action === 'unban') {
            update = { isBanned: false }
            successMessage = "User was unbanned successfully"
        } else {
            throw createError(400, "invalid action.Use 'ban' or 'unban'")
        }


        const updateOptions = { new: true, runValidators: true, contxt: 'query' }
        const updatedUser = await User.findByIdAndUpdate(userid, update, updateOptions).select('-password')

        if (!updatedUser) throw createError(400, 'user was not banned succesfully')
        return successResponse(res, {
            statusCode: 200,
            message: successMessage,
        })
    } catch (error) {
        next(error);
    }

}
const handleUpdateUserPasswordById = async (req, res, next) => {
    try {
        const { oldPassword, newPassword, confirmPassword, email } = req.body
        const userid = req.params.id

        const userExists = await User.exists({ email: email })
        if (!userExists) throw createError(404, 'user not found')

        const user = await findingById(User, userid)
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordMatch) throw createError(400, "old password did not match")
        if (newPassword !== confirmPassword) throw createError(400, "passwords do not match")

        const updatedUser = await User.findByIdAndUpdate(userid, { password: newPassword }, { new: true, runValidators: true, contxt: 'query' }).select('-password')

        if (!updatedUser) throw createError(400, 'user password was not updated succesfully')

        return successResponse(res, {
            statusCode: 200,
            message: "user's password was updated successfully",
            payload: { updatedUser }
        })
    } catch (error) {
        next(error);
    }

}
const handleUserForgotPasswordByMail = async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email: email })

        if (!user) throw createError(404, 'Email is incorrect or you have not varified your email.Please register youself first')

        const token = createJWT({ email }, jwtResetPasswordKey, '5m')

        const emailData = {
            email,
            subject: 'Reset PAssword Mail',
            html: `<h2>Hello ${user.name}</h2>
            <p>Please click here to <a href="${clientUrl}/api/users/reset-password/${token}" target="_blanck">Reset Your Password</a></p>
            `
        }
        try { await emailWithNodeMailer(emailData) }
        catch (emailError) {
            next(createError(500, 'Failed to send verification email'))
            return
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Please check your ${email} to reset your password`,
            payload: { token }
        })
    } catch (error) {
        next(error);
    }

}
const handleResetUserPasswordByMail = async (req, res, next) => {
    try {
        const { token, setPassword } = req.body

        const decoded = jwt.verify(token, jwtResetPasswordKey)
        if (!decoded) throw createError(401, 'unable to verify user')

        const updatedUser = await User.findOneAndUpdate({ email: decoded.email }, { password: setPassword }, { new: true, runValidators: true, contxt: 'query' }).select('-password')
        if (!updatedUser) throw createError(400, 'Password reset failed')

        return successResponse(res, {
            statusCode: 200,
            message: "password reset successfully",
            payload: {}
        })
    } catch (error) {
        next(error);
    }
}
module.exports = { getUsers, getUserById, deleteUserById, proccessRegister, activateUserAccount, updateUserById, handleManageUserById, handleUpdateUserPasswordById, handleUserForgotPasswordByMail, handleResetUserPasswordByMail }