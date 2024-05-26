import { SubserviceEntity } from "src/subservice/subservice.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EnvironmentType } from "../enums/environmentType";
import { OrderEntity } from "./order.entity";

@Entity({ name: 'order_subservices' })
export class OrderSubserviceEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => SubserviceEntity)
    @JoinColumn()
    subservice: SubserviceEntity;

    @OneToOne(() => UserEntity, user => user.id)
    @JoinColumn()
    worker: UserEntity;

    @Column({ name: 'amount', type: 'double precision' })
    amount: number;

    @Column({ name: 'quantity', type: 'double precision' })
    quantity: number;

    @Column({ name: 'type', type: 'enum', enum: EnvironmentType })
    environment: EnvironmentType;

    @ManyToOne(() => OrderEntity, (order) => order.payments,
        { orphanedRowAction: "delete", onDelete: "CASCADE", onUpdate: "CASCADE" })
    order: OrderEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

}