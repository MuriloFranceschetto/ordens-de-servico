import { Person } from 'src/person/entities/person.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Work {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'varchar', length: 100 })
	title: string;

	@Column({ type: 'varchar', length: 5000 })
	description: string;

	@ManyToMany(() => Person, (Person) => Person.id)
	@JoinColumn({ referencedColumnName: 'id' })
	responsable: Person;
}
