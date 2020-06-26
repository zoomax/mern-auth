const Joi = require("joi");

module.exports = {
    validateBody: function (schema) {
        return function (req, res, next) {
            const { error, value } = Joi.validate(req.body, schema);
            if (error) {
                return res.status(400).json({
                    error
                });
            }
            if (!req.value) req.value = {};
            if (!req.value.body) req.value.body = {};
            req.value.body = value;
            next();

        }
    },
    schemas: {
        signinSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(7).required()

        })
    }
}