import * as Joi from '@hapi/joi';
import { empty } from 'rxjs';

export const configValidationSchema = Joi.object({
  ENVIRONMENT: Joi.string().required(),
  API_PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});