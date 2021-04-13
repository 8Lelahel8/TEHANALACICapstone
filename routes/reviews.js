const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../joiSchemas');
const AppError = require('../utilities/AppError');
const asyncCatcher = require('../utilities/asyncCatcher');
const { validateReview, isAuthenticated, isReviewCreator } = require('../middleware/middleware');
const BCorp = require('../models/bCorp');
const Review = require('../models/review');

// const validateReview = (req, res, next) => {
// 	const { error } = reviewSchema.validate(req.body);
// 	if (error) {
// 		const msg = error.details.map((e) => e.message).join(',');
// 		throw new AppError(msg, 400);
// 	} else {
// 		next();
// 	}
// };

// --------Review Routes--------

// The configuration of new routes starts with /bCorps

// Create a new review | EJS: Show
router.post(
	'/',
	isAuthenticated,
	validateReview, 
	asyncCatcher( async (req, res) => {
	const { id } = req.params;
	const bCorp = await BCorp.findById(id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	bCorp.reviews.push(review);
	await bCorp.save();
	await review.save();
    req.flash('Success', 'Your review was successfully created!');
	res.redirect(`/bCorps/${id}`);
	})
);

router.delete(
	'/:reviewId',
	isAuthenticated,
	isReviewCreator,
	asyncCatcher(async (req, res) => {
		const { id, reviewId } = req.params;
		await BCorp.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
        req.flash('Success', 'Your review was successfully deleted!');
		res.redirect(`/bCorps/${id}`);
	})
);

module.exports = router;