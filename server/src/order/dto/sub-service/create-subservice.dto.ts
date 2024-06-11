import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty } from "class-validator";

import { EnvironmentType } from "src/order/enums/environmentType";
import { ListSubserviceDto } from "src/subservice/dto/list-subservice.dto";
import { ListUserDto } from "src/user/dto/UserList.dto";
import { ListOrderDto } from "../order/list-order.dto";

export class CreateSubserviceOrderDto {

    @IsNotEmpty({ message: 'The property subservice cannot be empty' })
    @Type(() => ListSubserviceDto)
    subservice: ListSubserviceDto;

    @IsNotEmpty({ message: 'The property worker cannot be empty' })
    @Type(() => ListUserDto)
    worker: ListUserDto;

    @IsNotEmpty({ message: 'The property environment cannot be empty' })
    @IsEnum(EnvironmentType)
    environment: EnvironmentType;

    @IsNotEmpty({ message: 'The property amount cannot be empty' })
    amount: number;

    @IsNotEmpty({ message: 'The property quantity cannot be empty' })
    quantity: number;

    @IsNotEmpty({ message: 'The property order cannot be empty' })
    order: ListOrderDto;

}