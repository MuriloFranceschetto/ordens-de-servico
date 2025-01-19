import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {PaymentStatus} from "../enums/PaymentStatus";
import {UserEntity} from "../../user/user.entity";
import {OrderPaymentEntity} from "./order-payment.entity";
import {OrderSubserviceEntity} from "./order-subservice.entity";
import {OrderStatus} from "../enums/OrderStatus";

@Entity({name: 'orders'})
export class OrderEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'title', length: 100})
    title: string;

    @Column({name: 'description', length: 8000})
    description: string;

    @Column({name: 'datetime_in', type: 'timestamptz'})
    datetimeIn: Date;

    @Column({name: 'datetime_out', type: 'timestamptz'})
    datetimeOut: Date;

    @Column({name: 'order_status', type: 'enum', enum: OrderStatus}, {nullable: true})
    orderStatus: OrderStatus;

    @Column({name: 'payment_status', type: 'enum', enum: PaymentStatus})
    paymentStatus: PaymentStatus;

    @ManyToOne(() => UserEntity, user => user.id, {eager: true})
    @JoinColumn()
    client: UserEntity;

    @OneToMany(() => OrderPaymentEntity, payment => payment.order, {cascade: true, eager: true, nullable: true})
    payments: OrderPaymentEntity[];

    @OneToMany(() => OrderSubserviceEntity, subservice => subservice.order, {
        cascade: true,
        eager: true,
        nullable: true
    })
    subservices: OrderSubserviceEntity[];

    @CreateDateColumn({name: 'created_at'})
    createdAt: string;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: string;

    @DeleteDateColumn({name: 'deleted_at'})
    deletedAt: string;

}