import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { OrderEntity } from "./order.entity";
import { UserEntity } from "src/user/user.entity";
import { EnvironmentType } from "../enums/EnvironmentType";
import { SubserviceEntity } from "src/subservice/subservice.entity";

@Entity({ name: 'order_subservices' })
export class OrderSubserviceEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'amount', type: 'double precision' })
    amount: number;

    @ManyToOne(() => SubserviceEntity, subservice => subservice.id, { eager: true })
    @JoinColumn()
    subservice: SubserviceEntity;

    @ManyToOne(() => UserEntity, user => user.id, { eager: true })
    @JoinColumn()
    worker: UserEntity;

    @Column({ name: 'quantity', type: 'double precision' })
    quantity: number;

    @Column({ name: 'type', type: 'enum', enum: EnvironmentType })
    environment: EnvironmentType;

    @ManyToOne(() => OrderEntity, (order) => order.subservices,
        { orphanedRowAction: "delete", onDelete: "CASCADE", onUpdate: "CASCADE" })
    order: OrderEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

}