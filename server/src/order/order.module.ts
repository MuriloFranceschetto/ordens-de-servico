import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { OrderPaymentEntity } from "./entities/order-payment.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity, OrderPaymentEntity]),
    ],
    controllers: [
        OrderController,
    ],
    providers: [
        OrderService,
    ],
})
export class OrderModule { };