import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentStatus } from "../enums/paymentStatus";
import { UserEntity } from "src/user/user.entity";
import { OrderPaymentEntity } from "./order-payment.entity";
import { Transform } from "class-transformer";
import moment from "moment";

@Entity({ name: 'orders' })
export class OrderEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'title', length: 100 })
    title: string;

    @Column({ name: 'description', length: 8000 })
    description: string;

    @Column({ name: 'datetime_in', type: 'timestamptz' })
    datetimeIn: Date;

    @Column({ name: 'datetime_out', type: 'timestamptz' })
    datetimeOut: Date;

    @Column({ name: 'open', type: 'boolean' })
    open: boolean;

    @Column({ name: 'payment_status', type: 'enum', enum: PaymentStatus })
    paymentStatus: PaymentStatus;

    @ManyToOne(() => UserEntity, user => user.id, { eager: true })
    @JoinColumn()
    client: UserEntity;

    @OneToMany(() => OrderPaymentEntity, payment => payment.order, { cascade: true, eager: true, nullable: true })
    payments: OrderPaymentEntity[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

}