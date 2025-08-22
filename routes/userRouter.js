const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");


userRouter.get("/login", userController.userLoginGet);
userRouter.post("/login", userController.userLoginPost);
userRouter.get("/logout", userController.userLogoutGet);
userRouter.get("/register", userController.userRegisterGet);
userRouter.post("/register", userController.userRegisterPost);
userRouter.get("/logout", userController.userLogoutGet);
userRouter.get("/membership", userController.userMembershipGet);
userRouter.post("/membership", userController.userMembershipPost);
userRouter.get("/cancel-member", userController.cancelMembershipGet);
userRouter.post("/cancel-member", userController.cancelMembershipPost);
userRouter.get("/become-admin", userController.userAdminGet);
userRouter.post("/become-admin", userController.userAdminPost);
userRouter.get("/cancel-admin", userController.cancelAdminGet);
userRouter.post("/cancel-admin", userController.cancelAdminPost);
userRouter.get("/delete", userController.deleteAccountGet);
userRouter.post("/delete", userController.deleteAccountPost);


module.exports = userRouter;