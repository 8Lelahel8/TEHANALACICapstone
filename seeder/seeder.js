const mongoose = require('mongoose');
const bCorp = require("../models/bCorp");

// Mongoose Connecting to Mongo
mongoose
	.connect('mongodb://localhost:27017/BCorporationReviewSite', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Mongo Connection Open');
	})
	.catch((error) => handleError(error));

const sampleData = [
    {
        corpName: "The Better Packaging Co.", 
		image: 
		"https://s3.amazonaws.com/blab-impact-published-production/TdxC96mWn9QbmUlAy8tXVReuxuG4C0mu",
		dateFounded: "2014",
    	dateCertified: "December 2020",
    	ceo: "Yaa Gyasi",
		bCorpScore: "87",
		location: "Auckland, Auckland, New Zealand",
		description: "Home compostable packaging for eCommerce",
		details: "By making the most sustainable packaging materials and designs available and affordable to businesses of all sizes, The Better Packaging Co. has grown from start-up to the world’s premiere supplier of home compostable packaging for eCommerce. For the Better Packaging Co., there is no perfect solution, but instead a constant process of improvement underpinned by transparent communication, innovative design and impeccable credentials.",
		overallExperience: "Great",
		submittedBy: "606f499a48e27677048ac90e"
    },
    {
        corpName: "Renewable Resources Group", 
		image: 
		'https://s3.amazonaws.com/blab-impact-published-production/C4FCsbSsjkTrFCnAU0R8g01qq6TFaliT',
		dateFounded: "1988",
    	dateCertified: "March 2021",
    	ceo: "Ajaye Worjolo",
		bCorpScore: "95.1",
		location: "Los Angeles, California, United States",
		description: "Investment funds and asset management",
		details: "Renewable Resources Group (RRG) owns, manages, and develops agriculture, land, conservation, water, and renewable energy assets in the U.S. and internationally. RRG investments strive to generate strong financial returns by finding value in places normally overlooked because of industry silos. The areas they work in also present meaningful opportunities to improve agriculture, water, and energy systems in ways that benefit both people and the environment. Helping build a more sustainable future.",
		overallExperience: "Good",
		submittedBy: "606f499a48e27677048ac90e"
    },
    {
        corpName: "fors.earth GmbH", 
		image: 
		'https://s3.amazonaws.com/blab-impact-published-production/C4FCsbSsjkTrFCnAU0R8g01qq6TFaliT',
		dateFounded: "1998",
    	dateCertified: "December 2020",
    	ceo: "Ajaye Worjolo",
		bCorpScore: "82.4",
		location: "Munich, Bavaria, Germany",
		description: "Sustainability Consulting; Sustainability Strategy, Communications and Trainings",
		details: "Fors provides strategic consulting in sustainability - for clients who really mean it.Companies play a core role in the sustainable transformations of society – and their job is to support, challenge and encourage them.",
		overallExperience: "Good",
		submittedBy: "606f499a48e27677048ac90e"
    },
    {
        corpName: "Close the Gap Kenya Ltd", 
		image: 
		'https://s3.amazonaws.com/blab-impact-published-production/jUdtUFgECwr54lXOPmgHOotm7ClV6FRp',
		dateFounded: "2018",
    	dateCertified: "March 2021",
    	ceo: "Ajaye Worjolo",
		bCorpScore: "84.2",
		location: "Mombasa, Coast, Kenya",
		description: "Refurbished ICT hardware Incubation for entrepreneurs Training for NEET youth",
		details: "Close the Gap runs incubation programs for young entrepreneurs in the coastal area of Mombasa in Kenya. They offer training programs for youth to teach them about the circular economy, ICT hardware skills, soft skills, etc. Their refurbishment site in the Jomvu area allows them to distribute quality ICT equipment to the entire East African region.",
		overallExperience: "Excellent",
		submittedBy: "606f499a48e27677048ac90e"
    },
];

// We first clear our database and then add in our B Corporation sample
const seedDB = async () => {
	await bCorp.deleteMany({});
	const res = await bCorp.insertMany(sampleData)
		.then((data) => console.log('Data inserted'))
		.catch((e) => console.log(e));
};

// We run our seeder function then close the database after.
seedDB().then(() => {
	mongoose.connection.close();
});
