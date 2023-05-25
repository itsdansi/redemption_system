import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { GeneralInformation } from "./general-information.entity";
import { OrderEntity } from "./order.entity";
import { OrderStatus } from "../../data2/order.data";

@Entity('order_item')
export class OrderItem extends GeneralInformation {
    @Column('varchar')
    public name: string;

    @Column('varchar')
    public sku: string;

    @Column('enum', { enum: OrderStatus, default: OrderStatus.submitted })
    public status: OrderStatus

    @Column('int')
    public points: number;

    @Column('int')
    public quantity: number;

    @Column('varchar')
    public image_link: string;

    @ManyToOne(() => OrderEntity, order => order.orderItems)
    @JoinColumn({ name: 'order_id' })
    public order: OrderEntity

    public total: number

    @AfterLoad()
    public calculateTotal() {
        this.total = this.points * this.quantity
    }
}