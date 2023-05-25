import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import crypto from "crypto";

// import {User} from "../entity/user.entity";
import { TokenExpiredError, sign, verify } from "jsonwebtoken";
import AppError from "../utils/appError";
import env from "../env";
import { OTP } from "../entity/otp.entity";
import { User2 } from "../entity/user2.entity";

const accessSecert = env.accessTokenSecret as string;
export interface IGetUserAuthInfoRequest extends Request {
  user: string; // or any other type
}

export const authenticatedUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies["accessToken"];

    if (!accessToken) {
      return next(new AppError(401, "Access token not provided!"));
    }

    const payload: any = verify(accessToken, accessSecert, {
      ignoreExpiration: true,
    });

    if (!payload) {
      return next(new AppError(401, "Invalid token!"));
    }

    const user = await getRepository(User2).findOne({
      where: {
        phone: payload?.phone,
      },
    });

    if (!user) {
      return next(new AppError(401, "Invalid phone number!"));
    }

    const { phone, ...data } = user;

    res.send(data);
  } catch (e) {
    console.log(e);
    if (e instanceof TokenExpiredError) {
      return next(new AppError(401, "Token Expired!"));
    }
    return next(new AppError(401, "Invalid phone number!"));
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies["accessToken"];

    if (!accessToken) {
      return next(new AppError(401, "Access token not provided!"));
    }

    const payload: any = verify(accessToken, accessSecert);

    if (!payload) {
      return next(new AppError(401, "Invalid token!"));
    }

    const user = await getRepository(OTP).findOne({
      where: {
        phone: payload?.phone,
      },
    });

    if (!user) {
      return next(new AppError(401, "Invalid auth credential!"));
    }

    const { phone, ...data } = user;

    const { firstName, lastName, dob, email } = req.body;

    const newUser = await getRepository(User2).save({
      firstName,
      lastName,
      dob,
      email,
      phone,
    });
    res.send(newUser);
  } catch (e) {
    // console.log(e);
    if (e instanceof TokenExpiredError) {
      return next(new AppError(401, "Token Expired!"));
    }
    return next(new AppError(401, "Invalid auth credential!"));
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies["accessToken"];

    if (!accessToken) {
      return next(new AppError(401, "Access token not provided!"));
    }

    const payload: any = verify(accessToken, accessSecert, {
      ignoreExpiration: true,
    });

    if (!payload) {
      return next(new AppError(401, "Invalid token!"));
    }

    const user = await getRepository(OTP).findOne({
      where: {
        phone: payload?.phone,
      },
    });

    if (!user) {
      return next(new AppError(401, "Invalid auth credential!"));
    }

    const { phone, ...data } = user;
    const host = "https://nichino.com";
    const { firstName, lastName, dob, email } = req.body;
    const userName = `${firstName} ${lastName}`.replace(/\s/g, "");

    const referralLink = `${host}/join/${userName}`;

    const newUser = await getRepository(User2).save({
      firstName,
      lastName,
      dob,
      email,
      phone,
      referralLink,
    });
    res.send(newUser);
  } catch (e: any) {
    console.log(e);
    if (e instanceof TokenExpiredError) {
      return next(new AppError(401, "Token Expired!"));
    }
    if (e.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "User with this details(email/phone) already exist",
      });
    }
    return next(new AppError(401, "Invalid auth credential!"));
  }
};

export const generateReferralLink = async (
  req: IGetUserAuthInfoRequest,
  // req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const host = "nichino.com";

    // Trim the concated firstName and lastName
    const userName = `${req.user["firstName" as any]} ${
      req.user["lastName" as any]
    }`.replace(/\s/g, "");

    const referralLink = `${host}/join/${userName}`;
    const userId = req.user["id" as any];

    const userRepository = getRepository(User2);

    // Find the user by ID
    const user = await userRepository.findOne({ where: { id: userId as any } });

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found!" });
    }
    // Update the referralLink property
    user.referralLink = referralLink;

    // Save the updated user
    const updatedUser = await userRepository.save(user);

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
