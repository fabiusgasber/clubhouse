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
        if(user) return done(null, user);
        else return done(null, false);
    } catch (error) {
        return done(error);
    }
});


module.exports = passport;
