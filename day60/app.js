require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const forgotPassRouter = require("./routes/forgotPassword");

const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local").Strategy;
const expressLayouts = require("express-ejs-layouts");

const localPassport = require("./passport/local.passport");
const googlePassport = require("./passport/google.passport");
const guestMiddleware = require("./middlewares/guest.middleware");

const model = require("./models/index");

var app = express();

app.use(
  session({
    secret: "F8",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await model.User.findByPk(id);
  done(null, user);
});

passport.use("local", localPassport);
passport.use("google", googlePassport);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(expressLayouts);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/login", guestMiddleware, loginRouter);
app.use("/logout", guestMiddleware, logoutRouter);
app.use("/forgot-password", forgotPassRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
