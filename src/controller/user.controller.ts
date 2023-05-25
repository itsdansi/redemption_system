import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import crypto from "crypto";

// import {User} from "../entity/user.entity";
import {TokenExpiredError, sign, verify} from "jsonwebtoken";
import AppError from "../utils/appError";
import env from "../env";
import {OTP} from "../entity/otp.entity";
import {User2} from "../entity/user2.entity";

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

    const payload: any = verify(accessToken, accessSecert);
    console.log({payload});

    if (!payload) {
      return next(new AppError(401, "Invalid token!"));
    }

    const user = await getRepository(User2).findOne({
      where: {
        phone: payload?.phone,
      },
    });

    console.log("HEllo--------------", user);

    if (!user) {
      return next(new AppError(401, "Invalid phone number!"));
    }

    const {phone, ...data} = user;

    console.log({phone, data});

    res.send(data);
  } catch (e) {
    console.log(e);
    if (e instanceof TokenExpiredError) {
      return next(new AppError(401, "Token Expired!"));
    }
    return next(new AppError(401, "Invalid phone number!"));
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies["accessToken"];

    if (!accessToken) {
      return next(new AppError(401, "Access token not provided!"));
    }

    const payload: any = verify(accessToken, accessSecert);

    console.log({payload});

    if (!payload) {
      return next(new AppError(401, "Invalid token!"));
    }

    const user = await getRepository(OTP).findOne({
      where: {
        phone: payload?.phone,
      },
    });

    console.log("Hello----------------->", user);
    // console.log({user});

    if (!user) {
      return next(new AppError(401, "Invalid auth credential!"));
    }

    const {phone, ...data} = user;

    const {firstName, lastName, dob, email} = req.body;

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

    const payload: any = verify(accessToken, accessSecert);

    console.log({payload});

    if (!payload) {
      return next(new AppError(401, "Invalid token!"));
    }

    const user = await getRepository(OTP).findOne({
      where: {
        phone: payload?.phone,
      },
    });

    // console.log("Hello----------------->", user);
    // console.log({user});

    if (!user) {
      return next(new AppError(401, "Invalid auth credential!"));
    }

    const {phone, ...data} = user;

    const {firstName, lastName, dob, email} = req.body;

    const newUser = await getRepository(User2).save({
      firstName,
      lastName,
      dob,
      email,
      phone,
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
        message: "User with this details already exist",
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
    console.log(req.user);
    const host = "nichino.com";
    const userName = `${req.user["firstName" as any]} ${
      req.user["lastName" as any]
    }`.replace(/\s/g, "");

    const referralLink = `${host}/join/${userName}`;
    const userId = req.user["id" as any]; // Assuming you have the current user's ID

    const userRepository = getRepository(User2);

    // Find the user by ID
    const user = await userRepository.findOne({where: {id: userId as any}});

    if (!user) {
      console.log("User not found");
    }
    // Update the referralLink property
    user.referralLink = referralLink;

    // Save the updated user
    const updatedUser = await userRepository.save(user);

    console.log(updatedUser);
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// export const referralLink = async (
//   // req: IGetUserAuthInfoRequest,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   console.log("Hello");
//   try {
//     // const algorithm = "aes-256-cbc";
//     const secretKey = "YourSecretKey";
//     const algorithm = "AES-256-CBC"; // Update with your desired algorithm
//     const key = crypto.randomBytes(32); // 256-bit key for AES-256

//     // Update the encryptUsername function with the valid key
//     function encryptUsername(username: string) {
//       const iv = crypto.randomBytes(32); // Initialization Vector for AES-256-CBC
//       const cipher = crypto.createCipheriv(algorithm, key, iv);
//       let encrypted = cipher.update(username, "utf8", "hex");
//       encrypted += cipher.final("hex");
//       return encrypted;
//     }

//     // Function to decrypt the encrypted username using AES decryption
//     function decryptUsername(encryptedUsername: string) {
//       const iv = crypto.randomBytes(16); // Initialization Vector for AES-256-CBC
//       const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
//       let decrypted = decipher.update(encryptedUsername, "hex", "utf8");
//       decrypted += decipher.final("utf8");
//       return decrypted;
//     }

//     // Example usage
//     const username = "john_doe";
//     const encryptedUsername = encryptUsername(username);
//     const decryptedUsername = decryptUsername(encryptedUsername);

//     console.log("Original Username:", username);
//     console.log("Encrypted Username:", encryptedUsername);
//     console.log("Decrypted Username:", decryptedUsername);
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
