import {AfterLoad, Column, Entity, ManyToOne} from "typeorm";
import {GeneralInformation} from "./general-information.entity";
import {CartEntity} from "./cart.entity";
import {User2} from "./user2.entity";

@Entity("bank_transfer")
export class BankTransfer extends GeneralInformation {
  @Column({name: "account_number", type: "varchar"})
  public accountNumber: string;

  @Column("varchar")
  public ifsc: string;

  @Column("int")
  public points: number;

  @ManyToOne(() => User2, (user) => user.id)
  public user: User2;
}
