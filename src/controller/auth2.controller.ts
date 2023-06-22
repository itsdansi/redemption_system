import {NextFunction, Request, Response} from "express";
import {QueryFailedError, getRepository} from "typeorm";
import bcryptjs from "bcryptjs";
import {TokenExpiredError, sign, verify} from "jsonwebtoken";
import AppError from "../utils/appError";
import {User2} from "../entity/user2.entity";
import {
  generateOTP,
  //  sendOTPSMS,
  sendSMS,
} from "../helper/smsHelper";
import {OTP} from "../entity/otp.entity";
import env from "../env";

const accessSecert = env.accessTokenSecret as string;
const refreshSecert = env.refreshTokenSecret as string;

export const sendOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {phone} = req.body;
    const regex = /^[6789]\d{9,11}$/;
    const isValidPhone = regex.test(phone);
    if (!isValidPhone) {
      return res.status(400).send({message: "Not a valid phone phone number!"});
    }

    const authenticatedPhoneNumber = await User2.findOne({
      where: {phone},
      order: {createdAt: "DESC"},
    });

    if (!authenticatedPhoneNumber) {
      return res.status(401).json({
        status: "fail",
        message: "Only registerd phone number are allowed!",
      });
    }

    const otp = 123456;
    // var otp = generateOTP();
    console.log({otp});
    const result = await getRepository(OTP).save({
      phone,
      otp_token: otp as any,
    });

    const sentOtp = await sendSMS(phone, otp as any);
    console.log({sentOtp});

    res.status(200).send({message: "OTP Sent!"});
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "Phone number already exist",
      });
    }
    console.log(err);
    next(err);
  }
};

export const loginWithOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {otp, phone} = req.body;

    const result = await getRepository(OTP).findOne({
      where: {phone, otp_token: otp as any, isUsed: false},
      order: {createdAt: "DESC"},
    });

    if (!result) {
      return res.status(400).send({message: "Invalid OTP"});
    }

    const otpCreatedTime = result.createdAt;
    const currentTime = new Date();
    const otpExpirationTime = new Date(
      otpCreatedTime.getTime() + 19800000 + 20 * 60 * 1000
    ); // Adding 20 minutes to OTP creation time; 20700000 is the gap between timezone in milliseconds.

    if (currentTime > otpExpirationTime) {
      // OTP has expired
      return res.status(400).send({message: "OTP has expired"});
    }

    // mark otp as used
    result.isUsed = true;
    await getRepository(OTP).save(result);

    // OTP is valid, proceed with generating tokens and sending the response

    const accessToken = sign(
      {
        phone,
      },
      accessSecert,
      {expiresIn: 60 * 60}
    );

    const refreshToken = sign({phone}, refreshSecert, {
      expiresIn: 24 * 60 * 60,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      // path: ".nupipay.com",
      domain: ".nupipay.com",
      maxAge: 24 * 60 * 60 * 1000, // equivalent to 1 day
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      domain: ".nupipay.com",
      maxAge: 7 * 24 * 60 * 60 * 1000, // equivalent to 7 days
    });

    res.send({
      message: "success",
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const refreshTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies["refreshToken"];
    const payload: any = verify(refreshToken, refreshSecert);

    if (!payload) {
      return next(new AppError(400, "Invalid email or password!"));
    }

    const accessToken = sign(
      {
        id: payload.id,
      },
      accessSecert,
      {expiresIn: 60 * 60}
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //equivalent to 1 day
    });

    res.send({
      message: "success",
      access_token: accessToken,
    });
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return next(new AppError(401, "Token Expired!"));
    }
    return next(new AppError(401, "Invalid auth credential!"));
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  if (req.cookies["accessToken"]) {
    res.cookie("accessToken", "", {maxAge: 0});
    res.cookie("refreshToken", "", {maxAge: 0});
    return res.status(200).json({message: "Logout successfully!"});
  }
  return res.status(400).json({message: "Already logout!"});
};
