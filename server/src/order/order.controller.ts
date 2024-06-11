import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { OrderService } from "./order.service";
import { ListOrderDto } from "./dto/order/list-order.dto";
import { plainToInstance } from "class-transformer";
import { ResponseOrderDto } from "./dto/order/response-order.dto";
import { PaymentOrderDto } from "./dto/payment/payment-order.dto";
import { CreatePaymentOrderDto } from "./dto/payment/create-payment-order.dto";
import { CreateOrderDTO } from "./dto/order/create-order.dto";
import { UpdatePaymentOrderDto } from "./dto/payment/update-payment-order.dto";
import { CreateSubserviceOrderDto } from "./dto/sub-service/create-subservice.dto";
import { SubserviceOrderDTO } from "./dto/sub-service/subservice-order.dto";
import { UpdateSubserviceOrderDto } from "./dto/sub-service/update-subservice.dto";

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

    @Put()
    async updateOrder(@Body() orderData: any) {
        try {
            const order = await this.orderService.updateOrder(orderData);
            return {
                order: plainToInstance(ListOrderDto, order),
                message: 'Successfull order update!'
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Delete('/:id')
    async deleteOrder(@Param('id') id: string) {
        let deleteResult = await this.orderService.deleteOrder(id);
        return {
            deleteResult,
            message: 'Successfull order delete!'
        };
    }

    @Post('/payment')
    async createPayment(@Body() paymentData: CreatePaymentOrderDto) {
        try {
            const payment = await this.orderService.createPayment(paymentData);
            return {
                payment: plainToInstance(PaymentOrderDto, payment),
                message: 'Successfull payment creation!'
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Put('/payment')
    async updatePayment(@Body() paymentData: UpdatePaymentOrderDto) {
        try {
            const payment = await this.orderService.updatePayment(paymentData);
            return {
                payment: plainToInstance(PaymentOrderDto, payment),
                message: 'Successfull payment update!'
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Delete('/payment/:idOrder/:idPayment')
    async deletePayment(@Param('idOrder') idOrder: string, @Param('idPayment') idPayment: string) {
        let deleteResult = await this.orderService.deletePayment(idOrder, idPayment);
        return {
            deleteResult,
            message: 'Successfull payment delete!'
        };
    }

    @Post('/subservice')
    async createSubservice(@Body() SubserviceData: CreateSubserviceOrderDto) {
        try {
            const Subservice = await this.orderService.createSubservice(SubserviceData);
            return {
                Subservice: plainToInstance(SubserviceOrderDTO, Subservice),
                message: 'Successfull subservice creation!'
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Put('/subservice')
    async updateSubservice(@Body() SubserviceData: UpdateSubserviceOrderDto) {
        try {
            const subservice = await this.orderService.updateSubservice(SubserviceData);
            return {
                subservice: plainToInstance(SubserviceOrderDTO, subservice),
                message: 'Successfull subservice creation!'
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Delete('/subservice/:idOrder/:idSubservice')
    async deleteSubservice(@Param('idOrder') idOrder: string, @Param('idSubservice') idSubservice: string) {
        let deleteResult = await this.orderService.deleteSubservice(idOrder, idSubservice);
        return {
            deleteResult,
            message: 'Successfull Subservice delete!'
        };
    }

}
