const { handleLogin, handleLogOut, handleRefreshToken, handleProtected } = require('../controllers/authController');
const { isLoggedOut, isLoggedIn } = require('../middlewares/auth');
const { runValidation } = require('../validators/runValidation');
const { validateUserLoginInputs } = require('../validators/userValidation');


const authRouter = require('express').Router();

authRouter.get('/refresh-token', handleRefreshToken)
authRouter.get('/protected', handleProtected)

authRouter.post('/login', validateUserLoginInputs, runValidation, isLoggedOut, handleLogin)
authRouter.post('/logout', isLoggedIn, handleLogOut)

module.exports = authRouter;