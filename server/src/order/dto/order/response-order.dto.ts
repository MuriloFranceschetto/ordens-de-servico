import { Expose, Transform, Type } from "class-transformer";
import { ListUserDto } from "src/user/dto/UserList.dto";
import { PaymentStatus } from "../../enums/paymentStatus";
import { PaymentOrderDto } from "../payment/payment-order.dto";
import * as moment from "moment";

export class ResponseOrderDto {
    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    @Transform(({ value }) => moment(value).format('YYYY-MM-DDTHH:mm'))
    datetimeIn: Date;

    @Expose()
    @Transform(({ value }) => moment(value).format('YYYY-MM-DDTHH:mm'))
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