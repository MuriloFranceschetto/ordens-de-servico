import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { Repository } from "typeorm";
import { ListOrderDTO } from "./dto/list-order.dto";
import { CreateOrderDTO } from "./dto/create-order.dto";
import { randomUUID } from "crypto";


@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
    ) { }

    public async listOrders() {
        let orders = await this.orderRepository.find({ order: { id: 'ASC' } });
        return orders.map((order) => new ListOrderDTO(order.id, order.title, order.datetime_in, order.datetime_out, order.open, order.payment_status, order.client));
    }

    public async getOrderById(id: string) {
        return await this.orderRepository.findOne({
            where: {
                id,
            }
        });
    }

    public async createOrder(orderData: CreateOrderDTO): Promise<ListOrderDTO> {
        const orderEntity = new OrderEntity();
        orderEntity.title = orderData.title;
        orderEntity.description = orderData.description;
        orderEntity.client = orderData.client;
        orderEntity.datetimeIn = orderData.datetimeIn;
        orderEntity.datetimeOut = orderData.datetimeOut;
        orderEntity.open = orderData.open;
        orderEntity.paymentStatus = orderData.paymentStatus;
        orderEntity.id = randomUUID();
        await this.orderRepository.save(orderEntity);
        return orderEntity;
    }

    public async deleteOrder(id: string) {
        return await this.orderRepository.delete(id);
    }

}