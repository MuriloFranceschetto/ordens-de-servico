import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";

@Controller('/api/orders')
export class OrderController {

    constructor(
        // private subserviceService: SubserviceService,
    ) { }

    @Get()
    async getOrders() {
        return []; //await this.subserviceService.listSubservices();
    }

    @Get('/:id')
    async getSubserviceById(@Param('id') id: string) {
        // return await this.subserviceService.getSubserviceById(id);
    }

    @Post()
    async createSubservice(@Body() orderData: any) {
        // const subserviceEntity = await this.subserviceService.createSubservice(subserviceData);
        // return {
        //     user: new listSubserviceDTO(subserviceEntity.active, subserviceEntity.id, subserviceEntity.name, subserviceEntity.charged_per, subserviceEntity.price),
        //     message: 'Successfull user creation!'
        // };
    }

    @Put('/:id')
    async updateSubservice(@Param('id') id: string, @Body() subserviceData: any) {
        // await this.subserviceService.updateSubservice(id, subserviceData);
        // return {
        //     message: 'Successfull user update!'
        // };
    }

    @Delete('/:id')
    async deleteSubservice(@Param('id') id: string) {
        // let deleteResult = await this.subserviceService.deleteSubservice(id);
        // return {
        //     deleteResult,
        //     message: 'Successfull subservice delete!'
        // };
    }

}
