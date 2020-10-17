const joi = require('joi');
const pattern = /^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/;
const registerValidator = (user) => {
    const schema = joi.object({
        name: joi.string().min(3).max(255).required().regex(pattern),
        email: joi.string().email().min(3).max(255).required(),
        password: joi.string().min(8).max(1024).required(),
    });
    return schema.validate(user);
};

const loginValidator = (user) => {
    const schema = joi.object({
        email: joi.string().email().min(3).max(255).required(),
        password: joi.string().min(8).max(1024).required(),
    });
    return schema.validate(user);
};

const recoveryValidator = (email) => {
    const schema = joi.object({
        email: joi.string().email().required().min(3).max(255),
    });
    return schema.validate(email);
};

module.exports = { registerValidator, loginValidator, recoveryValidator };
