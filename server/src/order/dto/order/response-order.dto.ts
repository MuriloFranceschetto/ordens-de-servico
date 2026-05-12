import {Expose, Transform, Type} from "class-transformer";

import {ListUserDto} from "../../../user/dto/user-list.dto";
import {PaymentStatus} from "../../enums/PaymentStatus";
import {PaymentOrderDto} from "../payment/payment-order.dto";
import {SubserviceOrderDTO} from "../sub-service/subservice-order.dto";
import {OrderStatus} from "../../enums/OrderStatus";
import {formatedDateIfValid} from "../../../shared/utils/Utils";

export class ResponseOrderDto {

    @Expose()
    id: string;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    @Transform(formatedDateIfValid)
    datetimeIn: Date;

    @Expose()
    @Transform(formatedDateIfValid)
    datetimeOut: Date;

    @Expose()
    orderStatus: OrderStatus;

    @Expose()
    paymentStatus: PaymentStatus;

    @Expose()
    @Type(() => ListUserDto)
    client: ListUserDto;

    @Expose()
    @Type(() => PaymentOrderDto)
    payments: PaymentOrderDto[];

    @Expose()
    @Type(() => SubserviceOrderDTO)
    subservices: SubserviceOrderDTO[];

}