const db = require("../database/queries.js");
const { body, validationResult } = require("express-validator");
const passport = require("../utils/passport.js");
const {
  isEmailInUse,
  isEmailMatching,
  isPasswordMatching,
  isMembershipPassword,
  isAdminPassword,
  isCancelMembership,
  isCancelAdmin,
  isDeleteAccount,
} = require("../utils/validationHelper.js");

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage("First name must only contain letters.")
    .isLength({ min: 1, max: 20 })
    .withMessage("First name must be between 1 and 20 characters."),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage("Last name must only contain letters.")
    .isLength({ min: 1, max: 20 })
    .withMessage("Last name must be between 1 and 20 characters."),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address.")
    .isLength({ min: 3, max: 50 })
    .withMessage("Email must be between 3 and 50 characters.")
    .custom(isEmailInUse),
  body("confirmEmail").custom(isEmailMatching),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),
  body("confirmPassword").custom(isPasswordMatching),
];

const validateMembership = [
  body("membershipPassword").trim().toLowerCase().custom(isMembershipPassword),
];

const validateCancelMembership = [
  body("cancelMember").trim().custom(isCancelMembership),
];

const validateAdmin = [body("adminPassword").trim().custom(isAdminPassword)];

const validateCancelAdmin = [body("cancelAdmin").trim().custom(isCancelAdmin)];

const validateDeleteAccount = [
  body("deleteAccount").trim().custom(isDeleteAccount),
];

const userRegisterGet = (req, res) => res.render("pages/register");

const userRegisterPost = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .render("pages/register", { errors: errors.array() });
    await db.addUser(req.body);
    return res.redirect("/user/login");
  },
];

const userMembershipGet = (req, res, next) => {
  req.isAuthenticated()
    ? res.render("pages/membership")
    : res.redirect("/user/login");
};

const userMembershipPost = [
  validateMembership,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .render("pages/membership", { errors: errors.array() });
    await db.promoteToMember(req.user.id);
    return res.redirect("/");
  },
];

const userAdminGet = (req, res) => {
  if (!req.isAuthenticated()) res.redirect("/user/login");
  if (req.user.status === "user") res.redirect("/user/membership");
  return res.render("pages/admin");
};

const userAdminPost = [
  validateAdmin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).render("pages/admin", { errors: errors.array() });
    await db.promoteToAdmin(req.user.id);
    return res.redirect("/");
  },
];

const cancelMembershipGet = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/user/login");
  else if (req.user.status === "user") return res.redirect("/user/membership");
  else if (req.user.status === "member" || req.user.status === "admin") {
    return res.render("pages/cancel_membership");
  } else {
    return res.redirect("/");
  }
};

const cancelMembershipPost = [
  validateCancelMembership,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .render("pages/cancel_membership", { errors: errors.array() });
    await db.cancelMembership(req.user.id);
    return res.redirect("/");
  },
];

const cancelAdminGet = (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/user/login");
  else if (req.user.status === "user") return res.redirect("/user/membership");
  else if (req.user.status === "member")
    return res.redirect("/user/become-admin");
  else if (req.user.status === "admin") {
    return res.render("pages/cancel_admin");
  }
};

const cancelAdminPost = [
  validateCancelAdmin,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .render("pages/cancel_admin", { errors: errors.array() });
    await db.cancelAdmin(req.user.id);
    return res.redirect("/");
  },
];

const deleteAccountGet = (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/user/login");
  return res.render("pages/delete_account");
};

const deleteAccountPost = [
  validateDeleteAccount,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(400)
        .render("pages/delete_account", { errors: errors.array() });
    await db.deleteAccount(req.user.id);
    return res.redirect("/");
  },
];

const userLoginGet = (req, res) => res.render("pages/login");

const userLoginPost = (req, res, next) =>
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureMessage: true,
  })(req, res, next);

const userLogoutGet = (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    return res.redirect("/");
  });
};

const manageAccount = (req, res) => {
  if (
    req.user.status === "user" ||
    req.user.status === "member" ||
    req.user.status === "admin"
  ) {
    return res.render("pages/manage_account");
  } else return res.redirect("/user/login");
};

module.exports = {
  userRegisterGet,
  userRegisterPost,
  userMembershipGet,
  userMembershipPost,
  userAdminGet,
  userAdminPost,
  cancelAdminGet,
  cancelAdminPost,
  deleteAccountGet,
  deleteAccountPost,
  userLoginGet,
  userLoginPost,
  userLogoutGet,
  cancelMembershipGet,
  cancelMembershipPost,
  manageAccount,
};
