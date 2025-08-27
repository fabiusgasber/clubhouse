const db = require("../database/queries.js");
const { body, validationResult } = require("express-validator");

const validateMessage = [
  body("title")
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("Title must be between 2 and 20 characters long"),
  body("message")
    .trim()
    .isLength({ min: 2, max: 250 })
    .withMessage("Message must be between 2 and 250 characters long")
    .escape(),
];

const newMessageGet = (req, res) => {
  req.isAuthenticated()
    ? res.render("pages/add-message")
    : res.redirect("/user/login");
};

const newMessagePost = [
  validateMessage,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .render("pages/add-message", { errors: errors.array() });
    const { title, message } = req.body;
    await db.addMessage(req.user.id, title, message);
    res.redirect("/");
  },
];

const deleteMessage = async (req, res) => {
  await db.deleteMessage(req.params.id);
  res.redirect("/");
};

module.exports = {
  newMessageGet,
  newMessagePost,
  deleteMessage,
};
