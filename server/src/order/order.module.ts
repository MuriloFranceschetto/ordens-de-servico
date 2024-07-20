import { Module, ParseBoolPipe, ParseEnumPipe, ParseUUIDPipe } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { OrderPaymentEntity } from "./entities/order-payment.entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { UserModule } from "../../src/user/user.module";
import { OrderSubserviceEntity } from "./entities/order-subservice.entity";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity, OrderPaymentEntity, OrderSubserviceEntity]),
        UserModule,
        JwtModule,
    ],
    controllers: [
        OrderController,
    ],
    providers: [
        OrderService,
    ],
})
export class OrderModule { };