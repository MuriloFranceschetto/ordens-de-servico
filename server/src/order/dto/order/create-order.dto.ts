import { Type } from "class-transformer";
import { PaymentStatus } from "../../enums/paymentStatus";
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ListUserDto } from "src/user/dto/UserList.dto";

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

    @IsNotEmpty({ message: 'The property datetimeOut cannot be empty' })
    @Type(() => Date)
    datetimeOut: Date;

    @IsNotEmpty({ message: 'The property open cannot be empty' })
    @IsBoolean({ message: 'The property open must be a boolean' })
    open: boolean;

    @IsNotEmpty({ message: 'The property paymentStatus cannot be empty' })
    @IsEnum(PaymentStatus)
    paymentStatus: PaymentStatus;

    @IsNotEmpty({ message: 'The property client cannot be empty' })
    client: ListUserDto;
}