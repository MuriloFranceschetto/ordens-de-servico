import { Injectable } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { Work } from './entities/work.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WorkService {
	constructor(
		@InjectRepository(Work)
		private readonly workRepository: Repository<Work>,
	) {}

	create(createWorkDto: CreateWorkDto) {
		const person: Work = new Work();
		person.title = createWorkDto.title;
		person.description = createWorkDto.description;
		person.responsable = createWorkDto.responsable;
		return this.workRepository.save(person);
	}

	findAll() {
		return this.workRepository.find();
	}

	findOne(id: number) {
		return this.workRepository.findOneBy({ id });
	}

	update(id: number, updateWorkDto: UpdateWorkDto) {
		return `This action updates a #${id} work`;
	}

	remove(id: number) {
		return this.workRepository.delete(id);
	}
}
