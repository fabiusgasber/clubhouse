const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController.js");

indexRouter.get("/register", indexController.userRegisterGet);
indexRouter.post("/register", indexController.userRegisterPost);

module.exports = indexRouter;