import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Person {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 100 })
	name: string;

	@Column({ type: 'varchar', length: 30 })
	document: string;

	@Column({ type: 'varchar', length: 30 })
	phone: string;

	@Column({ type: 'enum', enum: ['User', 'Client', 'Supplier'] })
	type: string;
}
