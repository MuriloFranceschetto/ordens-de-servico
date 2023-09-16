import { Injectable } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PersonService {
	constructor(
		@InjectRepository(Person)
		private readonly personRepository: Repository<Person>,
	) {}

	create(createPersonDto: CreatePersonDto) {
		const person: Person = new Person();
		person.name = createPersonDto.name;
		person.document = createPersonDto.document;
		person.phone = createPersonDto.phone;
		person.type = createPersonDto.type;
		person.login = createPersonDto.login;
		person.password = createPersonDto.password;
		return this.personRepository.save(person);
	}

	findAll() {
		return this.personRepository.find();
	}

	findByLogin(login: string): Promise<Person> {
		return this.personRepository.findOneBy({ login });
	}

	findOne(id: number) {
		return this.personRepository.findOneBy({ id });
	}

	update(id: number, updatePersonDto: UpdatePersonDto) {
		const person: Person = new Person();
		person.name = updatePersonDto.name;
		person.document = updatePersonDto.document;
		person.phone = updatePersonDto.phone;
		person.type = updatePersonDto.type;
		person.login = updatePersonDto.login;
		person.password = updatePersonDto.password;
		person.id = id;
		return this.personRepository.save(person);
	}

	remove(id: number) {
		return this.personRepository.delete(id);
	}
}
