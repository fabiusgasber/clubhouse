const { Router } = require('express');
const authRouter = Router();
const authController = require("../controllers/authController.js");

authRouter.get("/login", authController.userLoginGet);
authRouter.post("/login", authController.userLoginPost);
authRouter.get("/logout", authController.userLogoutGet);

module.exports = authRouter;
