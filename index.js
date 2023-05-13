const express=require('express');
const mongoose=require('mongoose');
const flash = require("connect-flash"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  session = require("express-session"),
  path = require("path"),
  methodOverride = require("method-override");
   require("dotenv").config();
const app=express();
const URI =
  "mongodb+srv://admin:admin@cluster0.kzw2dy7.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
.then((req,res)=>{
    console.log('db is working');
})
.catch((error)=>{
    console.log('error is ',error);
})

// session
// const SESSION_PASS = process.env.SESSION_PASS;
const SESSION_PASS = process.env.SESSION_PASS;
app.use(
  session({
    secret: SESSION_PASS,
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// passport set up
const User = require("./models/user");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
// api
let hotelRoutes=require('./routes/hotel');
let loginRoutes=require('./routes/auth');
 let reviewRoutes = require('./routes/reviews');
  let usersRoutes = require("./routes/users");
//  let fileUpload=require('express-fileupload');
//  app.use(fileUpload);
app.use(hotelRoutes);
app.use(loginRoutes);
app.use(reviewRoutes);
app.use(usersRoutes);
const PORT=process.env.PORT;
app.listen(PORT,(req,res)=>{
    console.log('Server is running at 5000 ');
})