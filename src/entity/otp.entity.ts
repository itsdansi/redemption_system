import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({name: "otp_token"})
export class OTP extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  otp_token!: number;

  @Column({length: 15})
  // @Index({unique: true})
  phone!: string;

  @CreateDateColumn()
  createdAt!: Date;

  get createdAtFormatted(): string {
    // Convert UTC date to Indian time zone
    const indianTime = this.createdAt.toLocaleString("en-IN", {timeZone: "Asia/Kolkata"});
    return indianTime;
  }
}
