import { IsNotEmpty, IsString } from 'class-validator';
import { Person } from 'src/person/entities/person.entity';

export class CreateWorkDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsNotEmpty()
	responsable: Person;
}
