import { SubserviceEntity } from "src/subservice/subservice.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'order_subservices' })
export class OrderSubservice {

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

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

}