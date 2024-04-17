const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../config");


const isLoggedIn =async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw createHttpError(401, 'Access token not found.Please Log in')
        }
        const decoded = jwt.verify(accessToken, jwtAccessKey);
        if (!decoded) {
            throw createHttpError(401, 'Invalid access token.Please login again!')
        }
        req.user = decoded.user;
        next();
    } catch (error) {
        next(error);

    }
}
const isLoggedOut = async (req, res, next) => { 
    try {
        const accessToken = req.cookies.accessToken;
        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, jwtAccessKey);
                if (decoded) {
                    throw createHttpError(400, 'User is already logged in')
                }
            } catch (error) {
                throw error
            }
        }
        next();
    } catch (error) {
        next(error);
    }
}
const isAdmin = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            throw createHttpError(403, 'You are not authorized to access this resource')
        }
        next();
    } catch (error) {
        next(error);
    }
 }
module.exports = { isLoggedIn,isLoggedOut,isAdmin }