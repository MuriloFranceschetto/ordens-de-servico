import { PaymentType } from "../../enums/paymentType";
import { Expose, Type } from "class-transformer";
import { ListSubserviceDto } from "src/subservice/dto/list-subservice.dto";
import { ListUserDto } from "src/user/dto/UserList.dto";
import { ListOrderDto } from "../order/list-order.dto";
import { IsEnum } from "class-validator";

export class PaymentOrderDto {
    @Expose()
    amount: number;

    @Expose()
    id: string;

    @Expose()
    @IsEnum(PaymentType)
    type: PaymentType;

    @Type(() => ListUserDto)
    @Expose()
    payer: ListUserDto;

    @Type(() => ListOrderDto)
    @Expose()
    order: ListOrderDto;
}