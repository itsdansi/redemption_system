import Joi from "joi";

/**
 * GetAllProductsByFilter Schema
 */
export const getAllProductsByFilterSchema = Joi.object({
  points: Joi.number(),
});
