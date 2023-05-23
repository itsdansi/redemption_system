import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User2 {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  phone!: number;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  dob!: Date;

  @Column()
  oto!: number;

  @Column()
  password!: string;
}
