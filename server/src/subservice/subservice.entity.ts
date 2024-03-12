import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ChargeTypes } from "./charge-type";


@Entity({ name: 'subservices' })
export class SubserviceEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'active', type: 'boolean' })
    active: boolean;

    @Column({ name: 'name', length: 100 })
    name: string;

    @Column({ name: 'charged_per', type: 'enum', enum: ChargeTypes })
    charged_per: ChargeTypes;

    @Column({ name: 'price', type: 'double precision' })
    price: number;

}