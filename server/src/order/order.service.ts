import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { plainToClass, plainToInstance } from "class-transformer";

import { UserService } from "src/user/user.service";
import { OrderEntity } from "./entities/order.entity";
import { ListOrderDto } from "./dto/order/list-order.dto";
import { CreateOrderDTO } from "./dto/order/create-order.dto";
import { UpdateOrderDTO } from "./dto/order/update-order.dto";
import { OrderPaymentEntity } from "./entities/order-payment.entity";
import { CreatePaymentOrderDto } from "./dto/payment/create-payment-order.dto";
import { UpdatePaymentOrderDto } from "./dto/payment/update-payment-order.dto";
import { CreateSubserviceOrderDto } from "./dto/sub-service/create-subservice.dto";
import { UpdateSubserviceOrderDto } from "./dto/sub-service/update-subservice.dto";
import { OrderSubserviceEntity } from "./entities/order-subservice.entity";


@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        @InjectRepository(OrderPaymentEntity) private orderPaymentRepository: Repository<OrderPaymentEntity>,
        @InjectRepository(OrderSubserviceEntity) private orderSubserviceRepository: Repository<OrderSubserviceEntity>,
        @Inject(UserService) private userService: UserService,
    ) { }

    public async listOrders() {
        let orders = await this.orderRepository.find({ order: { id: 'ASC' } });
        return orders.map((order) => plainToInstance(ListOrderDto, order));
    }

    public async getOrderById(id: string) {
        return await this.orderRepository.findOne({
            where: {
                id,
            },
            relations: ['payments'],
            order: {
                payments: {
                    createdAt: "ASC"
                }
            }
        });
    }

    public async createOrder(orderData: CreateOrderDTO): Promise<ListOrderDto> {
        const orderEntity = plainToClass(OrderEntity, orderData);
        orderEntity.id = randomUUID();

        let clientById = await this.userService.verifyUserById(orderEntity.client?.id);
        await this.userService.verifyIfUserIsClient(clientById);

        orderEntity.client = clientById;

        await this.orderRepository.save(orderEntity);
        return orderEntity;
    }

    public async updateOrder(orderData: UpdateOrderDTO): Promise<ListOrderDto> {
        const orderEntity = plainToClass(OrderEntity, orderData);

        let clientById = await this.userService.verifyUserById(orderEntity.client?.id);
        await this.userService.verifyIfUserIsClient(clientById);

        orderEntity.client = clientById;

        await this.orderRepository.save(orderEntity);
        return orderEntity;
    }

    public async deleteOrder(id: string) {
        return await this.orderRepository.delete(id);
    }


    // -------------- PAYMENT ---------------------------------------------------

    public async createPayment(paymentData: CreatePaymentOrderDto) {
        const paymentEntity = plainToClass(OrderPaymentEntity, paymentData);
        paymentEntity.order = await this.getOrderById(paymentData.order.id);

        paymentEntity.payer = await this.userService.getUserById(paymentData.payer.id);
        await this.userService.verifyIfUserIsClient(paymentEntity.payer);

        paymentEntity.id = randomUUID();
        await this.orderPaymentRepository.save(paymentEntity);
    }

    public async updatePayment(paymentData: UpdatePaymentOrderDto) {
        const paymentEntity = plainToClass(OrderPaymentEntity, paymentData);
        paymentEntity.order = await this.getOrderById(paymentData.order.id);

        paymentEntity.payer = await this.userService.getUserById(paymentData.payer.id);
        await this.userService.verifyIfUserIsClient(paymentEntity.payer);

        await this.orderPaymentRepository.save(paymentEntity);
    }

    public async deletePayment(idOrder: string, idPayment: string) {
        await this.orderPaymentRepository.delete({
            id: idPayment,
            order: {
                id: idOrder,
            }
        });
    }

    // ------------- SUBSERVICE --------------------------------------------------

    public async createSubservice(subserviceData: CreateSubserviceOrderDto) {
        const subserviceEntity = plainToClass(OrderSubserviceEntity, subserviceData);
        subserviceEntity.order = await this.getOrderById(subserviceData.order.id);

        subserviceEntity.worker = await this.userService.getUserById(subserviceData.worker.id);
        await this.userService.verifyIfUserIsWorker(subserviceEntity.worker);

        subserviceEntity.id = randomUUID();
        await this.orderSubserviceRepository.save(subserviceEntity);
    }

    public async updateSubservice(subserviceData: UpdateSubserviceOrderDto) {
        const subserviceEntity = plainToClass(OrderSubserviceEntity, subserviceData);
        subserviceEntity.order = await this.getOrderById(subserviceData.order.id);

        subserviceEntity.worker = await this.userService.getUserById(subserviceEntity.worker.id);
        await this.userService.verifyIfUserIsWorker(subserviceEntity.worker);

        await this.orderSubserviceRepository.save(subserviceEntity);
    }

    public async deleteSubservice(idOrder: string, idSubservice: string) {
        await this.orderSubserviceRepository.delete({
            id: idSubservice,
            order: {
                id: idOrder,
            }
        });
    }

}