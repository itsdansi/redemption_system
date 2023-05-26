import {NextFunction, Request, Response} from "express";
import {getRepository} from "typeorm";
import {IRequestWithUser} from "../utils/type";
import {BankTransfer} from "../entity/bank-transfer.entity";
import {User2} from "../entity/user2.entity";
import AppError from "../utils/appError";

export const createTransfer = async (
  req: IRequestWithUser<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    let {id} = req?.user;
    console.log({id});
    const user = await getRepository(User2).findOne({where: {id}});

    const {account, ifsc, points} = req.body;

    if (parseInt(points) > user.points) {
      return next(new AppError(400, "Given points is greater than your points!"));
    }

    const transferDetails = new BankTransfer();
    transferDetails.user = id;
    transferDetails.accountNumber = account;
    transferDetails.ifsc = ifsc;
    transferDetails.points = points;

    user.points -= points;
    await Promise.all([
      getRepository(BankTransfer).save(transferDetails),
      getRepository(User2).save(user),
    ]);
    return res
      .status(201)
      .send({status: "success", message: "Amount trasnfereed successfully!"});
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getAllTrasnferHistory = async (
  req: IRequestWithUser<any, any, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    let {id} = req?.user;
    console.log(req.user);
    const trasnferHistory = await getRepository(BankTransfer).find({where: {user: {id}}});
    return res.status(200).send(trasnferHistory);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
