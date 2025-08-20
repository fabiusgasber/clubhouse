const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const passport = require("passport");
const indexRouter = require("./routes/indexRouter.js");
const authRouter = require("./routes/authRouter.js");
const userRouter = require("./routes/userRouter.js");
const pool = require("./database/pool.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded( { extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(session({ 
    secret: process.env.COOKIE_SECRET, 
    resave: false, 
    saveUninitialized: false,
    store:  new pgSession({
        pool,
        tableName: "user_sessions",
        createTableIfMissing: true
    }),
    cookie: { maxAge: 10 * 24 * 60 * 60 * 1000 } // 10 days
}));
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if(err) throw err;
    console.log(`Express app listening on port ${PORT}`);
})