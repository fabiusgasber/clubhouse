const db = require("../database/queries.js");

const homepageGet = async (req, res) => {
    try {
        const messages = await db.getMessages();
        res.render("pages/index.ejs", { messages });
    } catch (error) {
        console.error("homepageGet:", error);
        res.status(500).send("Internal server error");
    }
};

module.exports = { homepageGet };