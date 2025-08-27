const { Router } = require("express");
const messageRouter = Router();
const messageController = require("../controllers/messageController.js");

messageRouter.get("/new", messageController.newMessageGet);
messageRouter.post("/new", messageController.newMessagePost);
messageRouter.get("/delete/:id", messageController.deleteMessage);
module.exports = messageRouter;
