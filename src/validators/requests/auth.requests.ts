import {Request, Response, NextFunction} from "express";

import {validate} from "../../utils/requestValidator";

import {
  LoginSchema,
  RegisterSchema,
  ResetPasswordLinkSchema,
  ResetPasswordSchema,
} from "./schema/auth";

export async function validateLoginSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {body} = req;
    await validate(body, LoginSchema as any);
    next();
  } catch (error) {
    next(error);
  }
}

export async function validateRegisterSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {body} = req;
    await validate(body, RegisterSchema as any);
    next();
  } catch (error) {
    next(error);
  }
}

export async function validateResetPasswordLinkSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {body} = req;
    await validate(body, ResetPasswordLinkSchema as any);
    next();
  } catch (error) {
    next(error);
  }
}

export async function validateResetPasswordSchema(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {body} = req;
    await validate(body, ResetPasswordSchema as any);
    next();
  } catch (error) {
    next(error);
  }
}
