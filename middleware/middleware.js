const AppError = require('../utilities/AppError')
const BCorp= require('../models/bCorp');
const Review = require('../models/review');
const { bCorpSchema, reviewSchema } = require('../joiSchemas');

// User Authorization for Reviews
module.exports.isReviewCreator = async (req, res, next) => {
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId);
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'You are not authorized to do that');
		return res.redirect(`/restaurants/${id}`);
	}
	next();
};


// User Authentication 
// Users must be signed in for certain actions
module.exports.isAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.flash('error', 'You must be signed in to do that');
		return res.redirect('/login');
	}
	next();
};


// User Authorization
// Only a creator can edit and delete
module.exports.isCreator = async (req, res, next) => {
	const { id } = req.params;
	const bCorp = await bCorp.findById(id);
	if (!bCorp.submittedBy.equals(req.user._id)) {
		req.flash('error', 'You are not authorized to do that');
		return res.redirect(`/bCorps/${id}`);
	}
	next();
};

// Form validation
module.exports.validateBCorp = (req, res, next) => {
	const { error } = bCorpSchema.validate(req.body);
	if(error) {
		const msg = error.details.map((e) => e.message).join(",")
		throw new AppError(msg, 400)
	} else {
		next();
	}
};

// Review validation
module.exports.validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((e) => e.message).join(',');
		throw new AppError(msg, 400);
	} else {
		next();
	}
};