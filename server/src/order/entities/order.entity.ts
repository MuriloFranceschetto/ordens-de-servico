import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentStatus } from "../enums/paymentStatus";
import { UserEntity } from "src/user/user.entity";
import { OrderPaymentEntity } from "./order-payment.entity";

@Entity({ name: 'orders' })
export class OrderEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'title', length: 100 })
    name: string;

    @Column({ name: 'description', length: 8000 })
    description: string;

    @Column({ name: 'datetime_in', type: 'timestamptz' })
    datetime_in: Date;

    @Column({ name: 'datetime_out', type: 'timestamptz' })
    datetime_out: Date;

    @Column({ name: 'open', type: 'boolean' })
    open: boolean;

    @Column({ name: 'payment_status', type: 'enum', enum: PaymentStatus })
    payment_status: PaymentStatus;

    @OneToOne(() => UserEntity)
    @JoinColumn()
    client: UserEntity;

    @OneToMany(() => OrderPaymentEntity, (payment) => payment.id, { cascade: true, eager: true })
    payments: OrderPaymentEntity[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

}