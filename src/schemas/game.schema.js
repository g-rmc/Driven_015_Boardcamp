import joi from 'joi';

const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/, 'html').required(),
    stockTotal: joi.number().integer().min(1).required(),
    categoryId: joi.number().integer().required(),
    pricePerDay: joi.number().integer().min(1).required()
});

export { gameSchema };