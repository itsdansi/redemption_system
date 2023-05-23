import {Request, Response, NextFunction} from "express";

import {validate} from "../../utils/requestValidator";

import {getAllProductsByFilterSchema} from "./schema/product";

export async function validateGetProductFilterSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {query} = req;
    await validate(query, getAllProductsByFilterSchema as any);
    next();
  } catch (error) {
    next(error);
  }
}
