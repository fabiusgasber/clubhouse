const db = require("../database/queries.js");

const homepageGet = async (req, res) => {
  const messages = await db.getMessages();
  return res.render("pages/index.ejs", { messages });
};

module.exports = { homepageGet };
