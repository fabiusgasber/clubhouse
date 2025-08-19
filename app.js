const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const indexRouter = require("./routes/indexRouter.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded( { extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
    if(err) throw err;
    console.log(`Express app listening on port ${PORT}`);
})