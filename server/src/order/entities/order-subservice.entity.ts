import { SubserviceEntity } from "src/subservice/subservice.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

}