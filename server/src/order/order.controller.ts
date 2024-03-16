import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { OrderService } from "./order.service";
import { ListOrderDTO } from "./dto/list-order.dto";

@Controller('/api/orders')
export class OrderController {

    constructor(
        private orderService: OrderService,
    ) { }

    @Get()
    async getOrders() {
        try {
            return await this.orderService.listOrders();
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @Get('/:id')
    async getOrderById(@Param('id') id: string) {
        try {
            return await this.orderService.getOrderById(id);
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @Post()
    async createOrder(@Body() orderData: any) {
        try {
            const order = await this.orderService.createOrder(orderData);
            return {
                order: new ListOrderDTO(order.id, order.title, order.datetimeIn, order.datetimeOut, order.open, order.paymentStatus, order.client),
                message: 'Successfull order creation!'
            };
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @Put('/:id')
    async updateSubservice(@Param('id') id: string, @Body() orderData: any) {
        // await this.subserviceService.updateSubservice(id, subserviceData);
        // return {
        //     message: 'Successfull user update!'
        // };
    }

    @Delete('/:id')
    async deleteSubservice(@Param('id') id: string) {
        let deleteResult = await this.orderService.deleteOrder(id);
        return {
            deleteResult,
            message: 'Successfull order delete!'
        };
    }

}
