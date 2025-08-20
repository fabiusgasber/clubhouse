const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const db = require("../database/queries");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
    try {
      const user = await db.findUserByEmail(email);
      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.findUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

const userLoginGet = (req, res) => res.render("pages/login");

const userLoginPost = (req, res, next) => passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
})(req, res, next);

const userLogoutGet = (req, res, next) => {
    req.logout((error) => {
        if(error) return next(error);
        res.redirect("/");
    });
};

module.exports = {
    userLoginGet,
    userLoginPost,
    userLogoutGet
};
