import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubserviceEntity } from './subservice.entity';
import { Repository } from 'typeorm';
import { ListSubserviceDto } from './dto/list-subservice.dto';
import { randomUUID } from 'crypto';
import { CreateSubserviceDTO } from './dto/create-subservice.dto';
import { UpdateSubserviceDTO } from './dto/update-subservice.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SubserviceService {

    constructor(
        @InjectRepository(SubserviceEntity) private subserviceRepository: Repository<SubserviceEntity>,
    ) { }

    async listSubservices() {
        let subservices = await this.subserviceRepository.find({ order: { id: 'ASC' } });
        return subservices.map((sub) => plainToInstance(ListSubserviceDto, sub));
    }

    async getSubserviceById(id: string) {
        return await this.subserviceRepository.findOne({
            where: {
                id,
            }
        });
    }

    async createSubservice(subserviceData: CreateSubserviceDTO) {
        const subserviceEntity = new SubserviceEntity();
        subserviceEntity.active = subserviceData.active;
        subserviceEntity.name = subserviceData.name;
        subserviceEntity.charged_per = subserviceData.charged_per;
        subserviceEntity.price = subserviceData.price;
        subserviceEntity.id = randomUUID();
        await this.subserviceRepository.save(subserviceEntity);
        return subserviceEntity;
    }

    async updateSubservice(id: string, subserviceData: UpdateSubserviceDTO) {
        const subserviceEntity = new SubserviceEntity();
        subserviceEntity.name = subserviceData.name;
        subserviceEntity.active = subserviceData.active;
        subserviceEntity.charged_per = subserviceData.charged_per;
        subserviceEntity.price = subserviceData.price;
        return await this.subserviceRepository.update(id, subserviceData);
    }

    async deleteSubservice(id: string) {
        return await this.subserviceRepository.delete(id);
    }
}
