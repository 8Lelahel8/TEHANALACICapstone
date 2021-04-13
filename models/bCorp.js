const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const BCorporationSchema = new Schema({
    corpName: String,
    image: String,
    dateFounded: String,
    dateCertified: String,
    ceo: String,
    bCorpScore: String,
    location: String,
    description: String, 
    details: String,  
    overallExperience: String,
	submittedBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
    reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
});

BCorporationSchema.post('findOneAndDelete', async function (data) {
	if (data) {
		await Review.deleteMany({
			_id: {
				$in: data.reviews,
			},
		});
	}
});

module.exports = mongoose.model("BCorporation", BCorporationSchema);
