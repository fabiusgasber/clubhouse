require("dotenv").config();
const db = require("../database/queries");

const isEmailInUse = async (value) => {
  const user = await db.findUserByEmail(value);
  if (user) throw new Error("E-Mail already in use.");
  return true;
};

const isEmailMatching = async (value, { req }) => {
  if (value !== req.body.email) throw new Error("E-Mails do not match.");
  return true;
};

const isPasswordMatching = async (value, { req }) => {
  if (value !== req.body.password) throw new Error("Passwords do not match.");
  return true;
};

const isMembershipPassword = (value) => {
  if (value !== process.env.MEMBER_SECRET)
    throw new Error("Wrong answer. Try again.");
  return true;
};

const isAdminPassword = (value) => {
  if (value !== process.env.ADMIN_SECRET)
    throw new Error("Wrong answer. Try again.");
  return true;
};

const isCancelMembership = (value) => {
  if (value !== process.env.CANCEL_MEMBER)
    throw new Error("Wrong answer. Try again.");
  return true;
};

const isCancelAdmin = (value) => {
  if (value !== process.env.CANCEL_ADMIN)
    throw new Error("Wrong answer. Try again.");
  return true;
};

const isDeleteAccount = (value) => {
  if (value !== process.env.DELETE_ACCOUNT)
    throw new Error("Wrong answer. Try again.");
  return true;
};

module.exports = {
  isEmailInUse,
  isEmailMatching,
  isPasswordMatching,
  isMembershipPassword,
  isAdminPassword,
  isCancelMembership,
  isCancelAdmin,
  isDeleteAccount,
};
