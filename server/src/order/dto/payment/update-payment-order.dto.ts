import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { PaymentType } from "src/order/enums/paymentType";
import { ListUserDto } from "src/user/dto/UserList.dto";
import { ListOrderDto } from "../order/list-order.dto";
import { Type } from "class-transformer";

export class UpdatePaymentOrderDto {

    @IsNotEmpty({ message: 'The property id cannot be empty' })
    @IsUUID()
    id: string;

    @IsNotEmpty({ message: 'The property amount cannot be empty' })
    amount: number;

    @IsNotEmpty({ message: 'The property type cannot be empty' })
    @IsEnum(PaymentType)
    type: PaymentType;

    @IsNotEmpty({ message: 'The property payer cannot be empty' })
    payer: ListUserDto;

    @IsNotEmpty({ message: 'The property order cannot be empty' })
    order: ListOrderDto;

    @IsNotEmpty({ message: 'The property date cannot be empty' })
    @Type(() => Date)
    date: Date;

}