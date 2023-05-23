import * as Joi from "joi";

/**
 * Login Schema
 */
export const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * Register Schema
 */
export const RegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(20).required(),
  name: Joi.string().min(2).max(15).required(),
});

/**
 * ResetPasswordLink Schema
 */
export const ResetPasswordLinkSchema = Joi.object({
  email: Joi.string().email().required(),
});

/**
 * ResetPassword Schema
 */
export const ResetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
});
