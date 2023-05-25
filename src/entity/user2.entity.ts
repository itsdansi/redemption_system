import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import {CartEntity} from "./cart.entity";

@Entity()
export class User2 extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: "first_name", nullable: true})
  firstName: string;

  @Column({name: "last_name", nullable: true})
  lastName: string;

  @Column({length: 25})
  @Index({unique: true})
  phone!: string;

  @Column({
    unique: true,
    // nullable: true,
  })
  email: string;

  @Column({nullable: true})
  dob: Date;

  @Column({nullable: true})
  party: string;

  @Column({default: 0, nullable: true})
  points: number;

  @Column({default: 0, name: "pay_off", nullable: true})
  payOff: number;

  @Column({name: "referral_link", nullable: true})
  referralLink: string;

  @CreateDateColumn({name: "created_at"})
  createdAt: Date;

  @OneToOne(() => CartEntity, (cart) => cart.user)
  public cart: CartEntity;
}
