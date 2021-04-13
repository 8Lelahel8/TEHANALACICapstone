const express = require('express');
const router = express.Router();
const asyncCatcher = require('../utilities/asyncCatcher');
const {bCorpSchema} = require('../joiSchemas');
const AppError = require("../utilities/AppError");
const BCorp = require('../models/bCorp');
const { 
	isAuthenticated, 
	isCreator, 
	validateBCorp 
} = require('../middleware/middleware');
const { populate } = require('../models/bCorp');

// // --------Middleware--------

// // User Authorization
// const isCreator = async (req, res, next) => {
// 	const { id } = req.params;
// 	const bCorp = await bCorp.findById(id);
// 	if (!bCorp.submittedBy.equals(req.user._id)) {
// 		req.flash('error', 'You are not authorized to do that');
// 		return res.redirect(`/bCorps/${id}`);
// 	}
// 	next();
// };

// const validateBCorp = (req, res, next) => {
// 	const { error } = bCorpSchema.validate(req.body);
// 	if(error) {
// 		const msg = error.details.map((e) => e.message).join(",")
// 		throw new AppError(msg, 400)
// 	} else {
// 		next();
// 	}
// };


// --------BCorp Routes--------

// The configuration of new routes starts with /bCorps

// Rendering the Index Route
router.get(
	'/', 
	asyncCatcher( async (req, res) => {
    const bCorps = await BCorp.find({});
    res.render('bCorps/index', { bCorps });
	})
);

// Rendering a new B Corp form/ page
router.get(
	'/new', 
	isAuthenticated, 
	(req,res) => {
		res.render('bCorps/new');
});

// Creates a new B Corp | Route: Show/ Endpoint
router.post(
	'/', 
	isAuthenticated,
	validateBCorp,
	asyncCatcher( async (req, res) => { 
	const bCorp = new BCorp(req.body.bCorp);
	bCorp.submittedBy = req.user._id;
	await bCorp.save();
	req.flash('success', 'New B Corporation successfully added!')
	res.redirect(`/bCorps/${bCorp.id}`);
	})
);

// Rendering the show page for the details of an individual B Corporation
router.get(
	'/:id', 
	asyncCatcher( async (req, res, next) => {
    const { id } = req.params;
	const bCorp = await BCorp.findById(id)
		.populate({
			path: "reviews",
			populate: {
				path: "author"
			}
		})
		.populate('submittedBy');
		console.log(bCorp)
	if (!bCorp) {
		// return next(new AppError('Corporation not found!', 404));
		req.flash('error', 'The review page for that B Corporation has not been created yet')
		res.redirect('/bCorps')
		}
    	res.render('bCorps/show', { bCorp });
	})
);

// Rendering an edit form/page
router.get(
	'/:id/edit',
	isAuthenticated, 
	isCreator,
	asyncCatcher( async (req, res) => {
	const { id } = req.params;
	const bCorp = await BCorp.findById(id);
	res.flash('error', 'B Corporation does not exist')
	res.render('bCorps/edit', { bCorp });
	})
);

// Update a bCorp Endpoint
router.put(
	'/:id',
	isAuthenticated,
	isCreator,
	validateBCorp, 
	asyncCatcher( async (req, res) => {
	const { id } = req.params;
	const bCorp = await BCorp.findByIdAndUpdate(id, { ...req.body.bCorp})
	req.flash('success', 'B Corporation successfully edited!');
	res.redirect(`/bCorps/${bCorp.id}`);
	})
);

// Delete a bCorp
router.delete(
	'/:id/delete',
	isAuthenticated, 
	isCreator,
	asyncCatcher( async (req, res) => {
	const { id } = req.params;
	await BCorp.findByIdAndDelete(id);
	req.flash('success', 'B Corporation successfully deleted!');
	res.redirect('/bCorps');
	})
);

module.exports = router;
