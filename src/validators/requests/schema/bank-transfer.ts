import Joi from "joi";

/**
 * Create Bank Transfer Schema
 */

export const CreateTransfer = Joi.object({
  account: Joi.string().min(13).max(17).required().messages({
    "string.min": "Account number must be at least 13 characters long",
    "string.max": "Account number cannot exceed 17 characters",
    "any.required": "Account number is required",
  }),
  ifsc: Joi.string()
    .regex(/^[A-Za-z]{4}[0]{1}[A-Za-z0-9]{6}$/)
    .required()
    .messages({
      "string.pattern.base": "IFSC code is not valid",
      "any.required": "IFSC code is required",
    }),
  points: Joi.number().positive().required().messages({
    "number.positive": "Points must be a positive number",
    "any.required": "Points is required",
  }),
});
