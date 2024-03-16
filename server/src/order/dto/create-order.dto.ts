import { UserEntity } from "src/user/user.entity";
import { PaymentStatus } from "../enums/paymentStatus";
import { IsBoolean, IsDate, IsEnum, IsNotEmpty } from "class-validator";

export class CreateOrderDTO {

    @IsNotEmpty({ message: 'The property title cannot be empty' })
    title: string;

    @IsNotEmpty({ message: 'The property description cannot be empty' })
    description: string;

    @IsNotEmpty({ message: 'The property client cannot be empty' })
    client: UserEntity;

    @IsNotEmpty({ message: 'The property datetimeIn cannot be empty' })
    @IsDate({ message: 'The property datetimeIn must be a Date' })
    datetimeIn: Date;

    @IsNotEmpty({ message: 'The property datetimeOut cannot be empty' })
    @IsDate({ message: 'The property datetimeOut must be a Date' })
    datetimeOut: Date;

    @IsNotEmpty({ message: 'The property open cannot be empty' })
    @IsBoolean({ message: 'The property open must be a boolean' })
    open: boolean;

    @IsNotEmpty({ message: 'The property paymentStatus cannot be empty' })
    @IsEnum(PaymentStatus)
    paymentStatus: PaymentStatus;

}