const createHttpError = require("http-errors")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const { successResponse } = require("./responseController")
const createJWT = require("../helper/JWT")
const { jwtAccessKey, jwtRefreshKey } = require("../config")

const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) throw createHttpError(404, 'user doest not exist.Please register first')

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) throw createHttpError(401, 'invalid password/email')
        if (user.isBanned) throw createHttpError(403, 'User is banned.Contact admin for more information')


        const accessToken = createJWT({ user }, jwtAccessKey, '5m')
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'none',
            maxAge: 300000
        })

        const refreshToken = createJWT({ user }, jwtRefreshKey, '7d')
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const userWithoutPassword = user.toObject()
        delete userWithoutPassword.password


        return successResponse(res, {
            statusCode: 200,
            message: 'login successful',
            payload: { userWithoutPassword }
        })
    }
    catch (error) {
        next(error);
    }
}
const handleLogOut = async (req, res, next) => {
    try {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        return successResponse(res, {
            statusCode: 200,
            message: 'logout successful'
        })
    }
    catch (error) {
        next(error);
    }
}
const handleRefreshToken = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken
        const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey)
        if(!decodedToken)throw createHttpError(401,'Invalid Refresh Token.Plz log in')


        const accessToken = createJWT( decodedToken.user , jwtAccessKey, '5m')
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'none',
            maxAge: 300000
        })

        return successResponse(res, {
            statusCode: 200,
            message: 'new access token generated successfully'
        })
    }
    catch (error) {
        next(error);
    }
}
const handleProtected = async (req, res, next) => {
    const accessToken = req.cookies.accessToken
    if(!accessToken)throw createHttpError(401,'Access Token not found.Plz log in')
    const decodedToken = jwt.verify(accessToken, jwtAccessKey)
    if(!decodedToken)throw createHttpError(401,'Invalid Access Token.Plz log in')
    try {
        return successResponse(res, {
            statusCode: 200,
            message: 'protected resource accessed successfully'
        })
    }
    catch (error) {
        next(error);
    }
}

module.exports = { handleLogin, handleLogOut, handleRefreshToken, handleProtected}