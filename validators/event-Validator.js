import Joi from 'joi'

const eventSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  date_time: Joi.string().isoDate().required(),
  location: Joi.string().min(1).max(255).required(),
  capacity: Joi.number().integer().min(1).max(1000).required()
});

const userSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().required()
});

const registrationSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
  event_id: Joi.string().uuid().required()
});

export {
eventSchema,
userSchema,
registrationSchema
}