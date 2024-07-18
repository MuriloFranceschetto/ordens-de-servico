import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { plainToClass, plainToInstance } from "class-transformer";

import { UserService } from "../../src/user/user.service";
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
import { PaymentStatus } from "./enums/paymentStatus";

interface OrderFilterParams {
    title?: string,
    payment_status?: PaymentStatus,
    open?: boolean,
}

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        @InjectRepository(OrderPaymentEntity) private orderPaymentRepository: Repository<OrderPaymentEntity>,
        @InjectRepository(OrderSubserviceEntity) private orderSubserviceRepository: Repository<OrderSubserviceEntity>,
        @Inject(UserService) private userService: UserService,
    ) { }

    public async listOrders(filterParams: OrderFilterParams) {
        let query = this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect("order.client", "user")
            .limit(10);

        if (filterParams?.open) {
            query = query.andWhere('order.open = :open', { open: filterParams.open });
        }
        if (filterParams?.title) {
            query = query.andWhere('order.title ILIKE :title', { title: `%${filterParams.title}%` });
        }
        if (filterParams.payment_status !== undefined) {
            query = query.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: filterParams.payment_status });
        }

        let orders = await query.getMany();
        return orders.map((order) => plainToClass(ListOrderDto, order));
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

        await this.updateOrderPaymentStatus(paymentData.order.id);
    }

    public async updatePayment(paymentData: UpdatePaymentOrderDto) {
        const paymentEntity = plainToClass(OrderPaymentEntity, paymentData);
        paymentEntity.order = await this.getOrderById(paymentData.order.id);

        paymentEntity.payer = await this.userService.getUserById(paymentData.payer.id);
        await this.userService.verifyIfUserIsClient(paymentEntity.payer);

        await this.orderPaymentRepository.save(paymentEntity);

        await this.updateOrderPaymentStatus(paymentData.order.id);
    }

    public async deletePayment(idOrder: string, idPayment: string) {
        await this.orderPaymentRepository.delete({
            id: idPayment,
            order: {
                id: idOrder,
            }
        });
        await this.updateOrderPaymentStatus(idOrder);
    }

    // ------------- SUBSERVICE --------------------------------------------------

    public async createSubservice(subserviceData: CreateSubserviceOrderDto) {
        const subserviceEntity = plainToClass(OrderSubserviceEntity, subserviceData);
        subserviceEntity.order = await this.getOrderById(subserviceData.order.id);

        subserviceEntity.worker = await this.userService.getUserById(subserviceData.worker.id);
        await this.userService.verifyIfUserIsWorker(subserviceEntity.worker);

        subserviceEntity.id = randomUUID();
        await this.orderSubserviceRepository.save(subserviceEntity);

        await this.updateOrderPaymentStatus(subserviceEntity.order.id);
    }

    public async updateSubservice(subserviceData: UpdateSubserviceOrderDto) {
        const subserviceEntity = plainToClass(OrderSubserviceEntity, subserviceData);
        subserviceEntity.order = await this.getOrderById(subserviceData.order.id);

        subserviceEntity.worker = await this.userService.getUserById(subserviceEntity.worker.id);
        await this.userService.verifyIfUserIsWorker(subserviceEntity.worker);

        await this.orderSubserviceRepository.save(subserviceEntity);

        await this.updateOrderPaymentStatus(subserviceEntity.order.id);
    }

    public async deleteSubservice(idOrder: string, idSubservice: string) {
        await this.orderSubserviceRepository.delete({
            id: idSubservice,
            order: {
                id: idOrder,
            }
        });
        await this.updateOrderPaymentStatus(idOrder);
    }


    private async updateOrderPaymentStatus(idOrder: string) {
        const order = await this.getOrderById(idOrder);
        await this.orderRepository.update(idOrder, {
            paymentStatus: this.getPaymentStatusFromOrder(order),
        });
    }

    getPaymentStatusFromOrder(order: OrderEntity): PaymentStatus {
        if (!order.payments.length) {
            return PaymentStatus.NOT_PAID;
        }

        const getAmountFn = (list: (OrderPaymentEntity | OrderSubserviceEntity)[]) => {
            return list.map(item => item.amount).reduce((a, b) => a + b, 0);
        };

        const totalAmountSubservices: number = getAmountFn(order.subservices);
        const totalAmountPayments: number = getAmountFn(order.payments);

        if (totalAmountSubservices > totalAmountPayments) {
            return PaymentStatus.PARTIALLY_PAID;
        }
        else if (totalAmountPayments >= totalAmountSubservices) {
            return PaymentStatus.PAID;
        }
    }

}

