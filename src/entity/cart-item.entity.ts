import { AfterLoad, Column, Entity, ManyToOne } from "typeorm";
import { GeneralInformation } from "./general-information.entity";
import { CartEntity } from "./cart.entity";

@Entity('cart_item')
export class CartItem extends GeneralInformation {
    @Column('varchar')
    public name: string;

    @Column('varchar')
    public sku: string;

    @Column('int')
    public points: number;

    @Column('int')
    public quantity: number;

    @Column('varchar')
    public image_link: string;

    @ManyToOne(() => CartEntity, cart => cart.cartItems)
    public cart: CartEntity

    public total: number

    @AfterLoad()
    public calculateTotal() {
        this.total = this.points * this.quantity
    }
}