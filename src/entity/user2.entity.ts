import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User2 extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({name: "first_name"})
  firstName!: string;

  @Column({name: "last_name"})
  lastName!: string;

  @Column({length: 15})
  @Index({unique: true})
  phone!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  dob!: Date;

  @CreateDateColumn({name: "created_at"})
  createdAt!: Date;

  // @Column()
  // points!: number;
}
