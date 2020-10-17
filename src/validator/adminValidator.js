const joi = require('joi');
const pattern = /^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$/;

const editValidator = (body) => {
    const schema = joi.object({
        name: joi.string().min(3).max(255).regex(pattern),
        email: joi.string().email().min(3).max(255),
        password: joi.string().min(8).max(1024),
    });
    return schema.validate(body);
};

module.exports = { editValidator };
