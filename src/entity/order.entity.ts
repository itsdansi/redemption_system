import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { GeneralInformation } from "./general-information.entity";
import { User2 } from "./user2.entity";
import { OrderItem } from "./order-item.entity";
import { OrderStatus, ShippingDetails } from "../../data2/order.data";

@Entity('order')
export class OrderEntity extends GeneralInformation {
  @ManyToOne(() => User2, user => user.id)
  @JoinColumn({ name: 'order_id' })
  public user: User2

  @Column('enum', { enum: OrderStatus, default: OrderStatus.submitted })
  public status: OrderStatus

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { eager: true })
  public orderItems: OrderItem[]

  @Column('jsonb', { name: 'shipping_details' })
  public shippingDetails: ShippingDetails

  public subTotal: number
  public shipping_details: ShippingDetails
  public itemCount: number = 0

  @AfterLoad()
  afterLoadFunction() {
    this.subTotal = this.orderItems.reduce((prev, current) => {
      return current.total + prev;
    }, 0)
    this.itemCount = this.orderItems.length
  }
}