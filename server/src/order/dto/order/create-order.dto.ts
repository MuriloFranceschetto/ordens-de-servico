import { Type } from "class-transformer";
import {IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";

import { PaymentStatus } from "../../enums/PaymentStatus";
import { ListUserDto } from "../../../user/dto/user-list.dto";
import {OrderStatus} from "../../enums/OrderStatus";

export class CreateOrderDTO {

    @IsNotEmpty({ message: 'The property title cannot be empty' })
    @IsString()
    title: string;

    @IsNotEmpty({ message: 'The property description cannot be empty' })
    @IsString()
    description: string;

    @IsNotEmpty({ message: 'The property datetimeIn cannot be empty' })
    @Type(() => Date)
    datetimeIn: Date;

    @IsOptional()
    @Type(() => Date)
    datetimeOut: Date;

    @IsNotEmpty({ message: 'The property orderStatus cannot be empty' })
    @IsEnum(OrderStatus)
    orderStatus: OrderStatus;

    @IsNotEmpty({ message: 'The property paymentStatus cannot be empty' })
    @IsEnum(PaymentStatus)
    paymentStatus: PaymentStatus;

    @IsNotEmpty({ message: 'The property client cannot be empty' })
    client: ListUserDto;

}