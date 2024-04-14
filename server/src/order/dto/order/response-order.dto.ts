import { Expose, Type } from "class-transformer";
import { ListUserDto } from "src/user/dto/UserList.dto";
import { PaymentStatus } from "../../enums/paymentStatus";
import { PaymentOrderDto } from "../payment/payment-order.dto";

export class ResponseOrderDto {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    datetimeIn: Date;

    @Expose()
    datetimeOut: Date;

    @Expose()
    open: boolean;

    @Expose()
    paymentStatus: PaymentStatus;

    @Type(() => ListUserDto)
    @Expose()
    client: ListUserDto;

    @Type(() => PaymentOrderDto)
    @Expose()
    payments: PaymentOrderDto[];
}