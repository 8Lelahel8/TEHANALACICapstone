if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Joi = require('joi');
const AppError = require("./utilities/AppError");
const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');
const PassportLocal = require('passport-local');
const User = require('./models/user');

const MongoStore = require('connect-mongo');

const url = process.env.DB_STRING || 'mongodb://localhost:27017/BCorporationReviewSite'


// Import Routes
const bCorpRoutes = require('./routes/bCorps');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require ('./routes/users');

// const BCorp = require("./models/bCorp");
// const Review = require("./models/review");

// const asyncCatcher = require("./utilities/asyncCatcher");
// // const { bCorpSchema } = require('./joiSchemas');
// const bCorp = require("./models/bCorp");
// const { bCorpSchema, reviewSchema } = require('./joiSchemas');
// // Import Routes
// const bCorpRoutes = require('./routes/bCorps');


// Database Configuration - Mongoose Connecting to Mongo
// 'mongodb://localhost:27017/BCorporationReviewSite'
mongoose
	.connect(url, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Mongo Connection Open');
	})
	.catch((error) => handleError(error));

// Setting up EJS and its pathing
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine('ejs', ejsMate);

// Parsing the form body
app.use(express.urlencoded({ extended: true }));

// Method Override
app.use(methodOverride('_method'));

// Making the public folder available 
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, '/public')));

const secret = process.env.SECRET || 'drake';

const store = MongoStore.create({
	mongoUrl: url,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret: 'drake',
	},
});

// This checks for any errors that may occur.
store.on('error', (e) => {
	console.log('Store Error', e);
});

const sessionConfig = {
	store,
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

// app.use(flash());

// Connect Flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  --------Middleware--------
app.use((req, res, next) => {
	res.locals.user = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

// --------ROUTES--------

// --------Index Route--------
app.get('/', (req, res) => {
	res.render('Home');
});

// --------BCorp Routes--------
app.use('/bCorps', bCorpRoutes);

// ------- Review Routes -------
app.use('/bCorps/:id/reviews', reviewRoutes);

// -------- Auth Routes --------
app.use('/', authRoutes);

// --------404 Error Message--------
app.all('*', (req, res, next) => {
	next(new AppError('Page not found', 404));
});

// --------Error Middleware--------
app.use((err, req, res, next) => {
	const { status = 500 } = err;
	const { message = 'I am in danger' } = err;
	res.status(status).render('error', { err });
});

// --------App Listener--------
app.listen(3000, () => {
	console.log("Listening on port 3000")
});
