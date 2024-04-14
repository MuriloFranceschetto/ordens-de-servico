import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SubserviceService } from './subservice.service';
import { ListSubserviceDto } from './dto/list-subservice.dto';
import { CreateSubserviceDTO } from './dto/create-subservice.dto';
import { UpdateSubserviceDTO } from './dto/update-subservice.dto';
import { plainToInstance } from 'class-transformer';

@Controller('/api/subservices')
export class SubserviceController {

    constructor(
        private subserviceService: SubserviceService,
    ) { }

    @Get()
    async getSubservices() {
        return await this.subserviceService.listSubservices();
    }

    @Get('/:id')
    async getSubserviceById(@Param('id') id: string) {
        return await this.subserviceService.getSubserviceById(id);
    }

    @Post()
    async createSubservice(@Body() subserviceData: CreateSubserviceDTO) {
        const subserviceEntity = await this.subserviceService.createSubservice(subserviceData);
        return {
            subservice: plainToInstance(ListSubserviceDto, subserviceEntity),
            message: 'Successfull user creation!'
        };
    }

    @Put('/:id')
    async updateSubservice(@Param('id') id: string, @Body() subserviceData: UpdateSubserviceDTO) {
        await this.subserviceService.updateSubservice(id, subserviceData);
        return {
            message: 'Successfull user update!'
        };
    }

    @Delete('/:id')
    async deleteSubservice(@Param('id') id: string) {
        let deleteResult = await this.subserviceService.deleteSubservice(id);
        return {
            deleteResult,
            message: 'Successfull subservice delete!'
        };
    }

}
