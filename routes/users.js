const express = require('express');
const router = express.Router();
const User = require('../models/user');
const asyncCatcher = require('../utilities/asyncCatcher');
const passport = require('passport');

// Rendering the form
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Capturing the information from the form
router.post(
	'/register',
	asyncCatcher(async (req, res) => {
		try {
			const { email, username, password } = req.body;
			const user = new User({ email, username });
			const newUser = await User.register(user, password);
			req.login(newUser, (err) => {
				if (err) return next(e);
				req.flash('success', 'Welcome to the LACI B Corporation Review Site');
				res.redirect('/bCorps');
			});	
		} 	catch (e) {
			req.flash('error', e.message);
            res.redirect('/register');
		}
	})
);

router.get('/login', (req, res) => {
	res.render('users/login');
});

router.post(
	'/login',
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login',
	}),
	(req, res) => {
		req.flash('success', 'Welcome back to the LACI B Corporation Review Site');
		res.redirect('/bCorps');
	}
);

router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Come back soon!');
	res.redirect('/login');
});

module.exports = router;