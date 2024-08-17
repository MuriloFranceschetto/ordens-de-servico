import { PaymentType } from "../../enums/paymentType";
import { Expose, Type } from "class-transformer";
import { ListOrderDto } from "../order/list-order.dto";
import { IsEnum } from "class-validator";
import { ListUserDto } from "src/user/dto/user-list.dto";

export class PaymentOrderDto {

    @Expose()
    amount: number;

    @Expose()
    id: string;

    @Expose()
    @IsEnum(PaymentType)
    type: PaymentType;

    @Expose()
    @Type(() => ListUserDto)
    payer: ListUserDto;

    @Expose()
    @Type(() => ListOrderDto)
    order: ListOrderDto;

    @Expose()
    createdAt: Date;

    @Expose()
    @Type(() => Date)
    date: Date;
}