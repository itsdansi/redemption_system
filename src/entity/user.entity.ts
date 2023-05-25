// import {
//   BaseEntity,
//   Column,
//   CreateDateColumn,
//   Entity,
//   Index,
//   PrimaryGeneratedColumn,
// } from "typeorm";

// @Entity()
// export class Users extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id!: number;

//   @Column({name: "first_name", nullable: true})
//   firstName: string;

//   @Column({name: "last_name", nullable: true})
//   lastName: string;

//   @Column({length: 25})
//   @Index({unique: true})
//   phone!: string;

//   @Column({
//     unique: true,
//     // nullable: true,
//   })
//   email: string;

//   @Column({nullable: true})
//   dob: Date;

//   @Column({nullable: true})
//   party: string;

//   @Column({nullable: true})
//   points: number;

//   @Column({name: "pay_off", nullable: true})
//   payOff: number;

//   @Column({name: "referral_link", nullable: true})
//   referralLink: string;

//   @CreateDateColumn({name: "created_at"})
//   createdAt: Date;
// }
