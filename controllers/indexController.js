const db = require("../database/queries.js");
const { body, validationResult } = require("express-validator");

const isEmailInUse = async (value) => {
    const user = await db.findUserByEmail(value);
    if(user) throw new Error("E-Mail already in use.");
    return true;
};

const isEmailMatching = async (value, { req }) => {
    if(value !== req.body.email) throw new Error("E-Mails do not match.");
    return true;
};

const isPasswordMatching = async (value, { req }) => {
    if(value !== req.body.password) throw new Error("Passwords do not match.");
    return true;
};

const validateUser = [
    body("firstName").trim()
    .isAlpha().withMessage("First name must only contain letters.")
    .isLength({ min: 1, max: 20 }).withMessage("First name must be between 1 and 20 characters."),
    body("lastName").trim()
    .isAlpha().withMessage("Last name must only contain letters.")
    .isLength({ min: 1, max: 20 }).withMessage("Last name must be between 1 and 20 characters."),
    body("email").trim()
    .isEmail().withMessage("Invalid email address.")
    .isLength({ min: 3, max: 50 }).withMessage("Email must be between 3 and 50 characters.")
    .custom(isEmailInUse),
    body("confirmEmail").custom(isEmailMatching),
    body("password").trim()
    .isLength({ min: 5 }).withMessage("Password must be at least 5 characters long."),
    body("confirmPassword").custom(isPasswordMatching)
];

const userRegisterGet = (req, res) => res.render("pages/register");

const userRegisterPost = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).render("pages/register", { errors: errors.array() });
        try {
            await db.addUser(req.body);
            res.redirect("/");
        } catch (error) {
            console.error("userRegisterPost error:", error);
            res.status(500).send("Internal server error");
        }
    }
];

module.exports = {
    userRegisterGet,
    userRegisterPost,
};