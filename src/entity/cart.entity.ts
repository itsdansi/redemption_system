import { AfterLoad, Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { GeneralInformation } from "./general-information.entity";
import { User2 } from "./user2.entity";
import { CartItem } from "./cart-item.entity";

@Entity()
export class CartEntity extends GeneralInformation {
  @OneToOne(() => User2, user => user.cart)
  @JoinColumn({ name: 'user_id' })
  public user: User2

  @OneToMany(() => CartItem, cartItem => cartItem.cart, { eager: true })
  public cartItems: CartItem[]
  public itemCount: number = 0

  public grandTotal: number = 0
  @AfterLoad()
  afterLoadFunction() {
    this.itemCount = this.cartItems.length
    this.grandTotal = this.cartItems.reduce((prev, current) => {
      return current.total + prev;
    }, 0)
  }

}