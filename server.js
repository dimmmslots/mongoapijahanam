const express = require("express");
const mongoose = require("mongoose");
const { config } = require('dotenv')
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const User = require("./models/user.js");
const barangRouter = require("./routes/barangRoutes.js");
const connectEnsureLogin = require("connect-ensure-login");
config()

const app = express();
app.set('x-powered-by', false);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000,
  },
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.json());

const param = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}

const uri = process.env.MONGO_URI

app.get('/login', connectEnsureLogin.ensureLoggedOut(`/dashboard`), (req, res) => {
  res.sendFile(__dirname + '/static/login.html');
});

app.post("/login", passport.authenticate("local", { failureRedirect: '/' }), (req, res) => {
  res.redirect("/dashboard");
});

app.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.get('/register', connectEnsureLogin.ensureLoggedOut(`/dashboard`), (req, res) => {
  res.sendFile(__dirname + '/static/register.html');
});

app.post('/register', (req, res) => {
  User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
      if (err) {
          console.log(err);
          res.redirect('/register');
      } else {
          passport.authenticate('local')(req, res, () => {
              res.redirect('/dashboard');
          });
      }
  });
});

app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/static/dashboard.html");
});

app.use('/barang', barangRouter);

app.get("*", connectEnsureLogin.ensureLoggedIn(`/login`), (req, res) => {
  res.redirect("/dashboard");
});

mongoose.connect(uri, param);

mongoose.connection.once("open", () => {
  console.log("connected to database");
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running...");
  });
});

mongoose.connection.on("error", (err) => {
  console.log("Error:", err);
  process.exit(1);
});