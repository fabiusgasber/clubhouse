const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const passport = require("passport");
const indexRouter = require("./routes/indexRouter.js");
const userRouter = require("./routes/userRouter.js");
const messageRouter = require("./routes/messageRouter.js");
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
app.use((req, res, next) => {
  res.locals.messages = req.session.messages || [];
  req.session.messages = [];
  next();
});
app.use("/user", userRouter);
app.use("/messages", messageRouter);
app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if(err) throw err;
    console.log(`Express app listening on port ${PORT}`);
})