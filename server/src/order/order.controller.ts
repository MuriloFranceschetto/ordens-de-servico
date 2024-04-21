import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { OrderService } from "./order.service";
import { ListOrderDto } from "./dto/order/list-order.dto";
import { plainToInstance } from "class-transformer";
import { ResponseOrderDto } from "./dto/order/response-order.dto";
import { PaymentOrderDto } from "./dto/payment/payment-order.dto";
import { CreatePaymentOrderDto } from "./dto/payment/create-payment-order.dto";
import { CreateOrderDTO } from "./dto/order/create-order.dto";

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
            let order = await this.orderService.getOrderById(id);
            return plainToInstance(ResponseOrderDto, order)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @Post()
    async createOrder(@Body() orderData: CreateOrderDTO) {
        try {
            const order = await this.orderService.createOrder(orderData);
            return {
                order: plainToInstance(ListOrderDto, order),
                message: 'Successfull order creation!'
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Put('/:id')
    async updateSubservice(@Param('id') id: string, @Body() orderData: any) {
        try {
            const order = await this.orderService.updateOrder(id, orderData);
            console.log(order);
            return {
                order: plainToInstance(ListOrderDto, order),
                message: 'Successfull order update!'
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post('/payment')
    async createPayment(@Body() paymentData: CreatePaymentOrderDto) {
        try {
            const payment = await this.orderService.createPayment(paymentData);
            return {
                payment: plainToInstance(PaymentOrderDto, payment),
                message: 'Successfull order creation!'
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
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
