import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  ENVIRONMENT: Joi.string().required(),
  PORT: Joi.number(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});
