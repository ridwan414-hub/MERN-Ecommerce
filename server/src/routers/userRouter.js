const { getUsers, getUserById, deleteUserById, activateUserAccount, proccessRegister, updateUserById, handleManageUserById, handleUserForgotPasswordByMail, handleUpdateUserPasswordById, handleResetUserPasswordByMail } = require('../controllers/userController');
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middlewares/auth');
const { uploadUserImage } = require('../middlewares/uploadFile');
const { runValidation } = require('../validators/runValidation');
const { validateUserRegistrationInputs, validateUserForgotPasswordInputs, validateUserResetPasswordInputs, validateUserUpdatePasswordInputs } = require('../validators/userValidation');

const userRouter = require('express').Router();

userRouter.post("/process-register", uploadUserImage.single('image'), isLoggedOut, validateUserRegistrationInputs, runValidation, proccessRegister)

userRouter.get("/", isLoggedIn, isAdmin, getUsers)
userRouter.get("/:id", isLoggedIn, isAdmin, getUserById)
userRouter.put("/manage-user/:id", isLoggedIn,isAdmin,handleManageUserById)

userRouter.post("/activate", isLoggedOut, activateUserAccount)


userRouter.put("/reset-password",validateUserResetPasswordInputs,runValidation, handleResetUserPasswordByMail)
userRouter.put("/:id", uploadUserImage.single('image'), isLoggedIn, updateUserById)
userRouter.put("/update-password/:id", isLoggedIn, validateUserUpdatePasswordInputs, runValidation, handleUpdateUserPasswordById)

userRouter.delete("/:id", isLoggedIn, deleteUserById)

userRouter.post("/forgot-password", validateUserForgotPasswordInputs, runValidation, handleUserForgotPasswordByMail)

module.exports = userRouter;