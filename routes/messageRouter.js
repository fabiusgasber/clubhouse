const { Router } = require("express");
const messageRouter = Router();
const messageController = require("../controllers/messageController.js");

messageRouter.get("/new", messageController.newMessageGet);
messageRouter.post("/new", messageController.newMessagePost);

module.exports = messageRouter;