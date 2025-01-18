import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "./user-role";

@Entity({ name: 'users' })
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'name', length: 100 })
    name: string;

    @Column({ name: 'email', nullable: true, length: 70 })
    email: string;

    @Column({ name: 'phone', nullable: true, length: 30 })
    phone: string;

    @Column({ name: 'salt', nullable: true, length: 10 })
    salt: string;

    @Column({ name: 'password', nullable: true, length: 255 })
    password: string;

    @Column({ name: 'active', nullable: true })
    active: boolean;

    @Column({ name: 'price_per_hour', nullable: true, type: 'double precision' })
    pricePerHour: number;

    @Column("text", { array: true, default: [] })
    roles: UserRole[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;

}