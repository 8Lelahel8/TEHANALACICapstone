const Joi = require('joi');

module.exports.bCorpSchema = Joi.object({
    bCorp: Joi.object({ 
        corpName: Joi.string().required(),
        image: Joi.string().required(),
        dateFounded: Joi.string().required(),
        dateCertified: Joi.string().required(),
        ceo: Joi.string().required(),
        bCorpScore: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(), 
        details: Joi.string().required(),  
        overallExperience: Joi.string().required(),
    }),	
}); 

module.exports.reviewSchema = Joi.object({
	review: Joi.object({
		body: Joi.string().required(),
		rating: Joi.number().required().min(1).max(5),
	}).required(),
});
