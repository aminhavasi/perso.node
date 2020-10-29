const joi = require('joi');
const pattern = /^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/;

const resumeValidator = (body) => {
    const schmea = joi.object({
        name: joi.string().min(3).max(255).required().regex(pattern),
        family: joi.string().min(3).max(255).required().regex(pattern),
        bornDate: joi.string(),
        address: joi.string(),
        phoneNumber: joi.number().required(),
        email: joi.string().email().required(),
        education: joi.string(),
        achievements: joi.array(),
        skills: joi.array().items(
            joi.object({
                name: joi.string().min(3).max(255).required(),
                rate: joi.number().required(),
            })
        ),
        works: joi.array().items(
            joi.object({
                name: joi.string().min(3).max(255).required(),
                join: joi.string().min(3).max(255).required(),
                left: joi.string().min(2).max(255).required(),
            })
        ),
    });

    return schmea.validate(body);
};

const resumeDelete = (id) => {
    const schema = joi.object({
        _id: joi.string().required(),
    });

    return schema.validate(id);
};

const resumeEdit = (body) => {
    const schema = joi.object({
        _id: joi.string().required(),
        name: joi.string().min(3).max(255).regex(pattern),
        family: joi.string().min(3).max(255).regex(pattern),
        bornDate: joi.string(),
        address: joi.string(),
        phoneNumber: joi.number(),
        email: joi.string().email(),
        education: joi.string(),
        achievements: joi.array(),
        skills: joi.array().items(
            joi.object({
                name: joi.string().min(3).max(255),
                rate: joi.number(),
            })
        ),
        works: joi.array().items(
            joi.object({
                name: joi.string().min(3).max(255),
                join: joi.string().min(3).max(255),
                left: joi.string().min(2).max(255),
            })
        ),
    });
    return schema.validate(body);
};

module.exports = { resumeValidator, resumeDelete, resumeEdit };
