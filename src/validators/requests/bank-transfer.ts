import {Request, Response, NextFunction} from "express";

import {validate} from "../../utils/requestValidator";
import {CreateTransfer} from "./schema/bank-transfer";

export async function validateCreateBankTransfer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {body} = req;
    await validate(body, CreateTransfer as any);
    next();
  } catch (error) {
    next(error);
  }
}
