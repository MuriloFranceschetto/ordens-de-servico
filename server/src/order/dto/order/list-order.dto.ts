import {Expose, Type} from "class-transformer";
import {PaymentStatus} from "../../enums/PaymentStatus";
import {ListUserDto} from "../../../user/dto/user-list.dto";
import {OrderStatus} from "../../enums/OrderStatus";

export class ListOrderDto {

    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    datetimeIn: Date;

    @Expose()
    datetimeOut: Date;

    @Expose()
    orderStatus: OrderStatus;

    @Expose()
    paymentStatus: PaymentStatus;

    @Expose()
    @Type(() => ListUserDto)
    client: ListUserDto;
}