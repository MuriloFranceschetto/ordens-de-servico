import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { ObjectId, Repository } from "typeorm";
import { ListOrderDto } from "./dto/order/list-order.dto";
import { CreateOrderDTO } from "./dto/order/create-order.dto";
import { randomUUID } from "crypto";
import { plainToClass, plainToInstance } from "class-transformer";
import { OrderPaymentEntity } from "./entities/order-payment.entity";
import { UserService } from "src/user/user.service";
import { CreatePaymentOrderDto } from "./dto/payment/create-payment-order.dto";
import { UserRole } from "src/user/user-role";
import { UpdateOrderDTO } from "./dto/order/update-order.dto";
import { UpdatePaymentOrderDto } from "./dto/payment/update-payment-order.dto";


@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        @InjectRepository(OrderPaymentEntity) private orderPaymentRepository: Repository<OrderPaymentEntity>,
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

}