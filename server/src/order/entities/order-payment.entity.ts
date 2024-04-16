import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentType } from "../enums/paymentType";
import { OrderEntity } from "./order.entity";
import { UserEntity } from "src/user/user.entity";

@Entity({ name: 'order_payments' })
export class OrderPaymentEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'amount', type: 'double precision' })
    amount: number;

    @Column({ name: 'type', type: 'enum', enum: PaymentType })
    type: PaymentType;

    @ManyToOne(() => UserEntity, user => user.id, { eager: true })
    @JoinColumn()
    payer: UserEntity;

    @ManyToOne(() => OrderEntity, (order) => order.payments,
        { orphanedRowAction: "delete", onDelete: "CASCADE", onUpdate: "CASCADE" })
    order: OrderEntity;

}