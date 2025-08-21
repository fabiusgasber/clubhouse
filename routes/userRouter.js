const { Router } = require("express");
const userRouter = Router();
const userController = require("../controllers/userController");

userRouter.get("/register", userController.userRegisterGet);
userRouter.post("/register", userController.userRegisterPost);
userRouter.get("/membership", userController.userMembershipGet);
userRouter.post("/membership", userController.userMembershipPost);
userRouter.get("/become-admin", userController.userAdminGet);
userRouter.post("/become-admin", userController.userAdminPost);

module.exports = userRouter;