import {Request} from "express";
import {User} from "../models/User";

interface IRequestWithUser<P, Q, R, S> extends Request<P, Q, R, S> {
  user?: User;
}

export enum sortE {
  DESC = "DESC",
  ASC = "ASC",
}

export interface Iquery {
  status?: boolean;
  name?: any;
}
