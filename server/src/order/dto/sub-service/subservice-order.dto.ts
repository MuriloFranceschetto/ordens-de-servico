import { Expose, Type } from "class-transformer";
import { EnvironmentType } from "src/order/enums/EnvironmentType";
import { ListSubserviceDto } from "src/subservice/dto/list-subservice.dto";
import { ListOrderDto } from "../order/list-order.dto";
import { IsEnum } from "class-validator";
import { ListUserDto } from "src/user/dto/user-list.dto";

export class SubserviceOrderDTO {

    @Expose()
    id: string;

    @Expose()
    @Type(() => ListSubserviceDto)
    subservice: ListSubserviceDto;

    @Expose()
    @Type(() => ListUserDto)
    worker: ListUserDto;

    @Expose()
    @IsEnum(EnvironmentType)
    environment: EnvironmentType;

    @Expose()
    amount: number;

    @Expose()
    quantity: number;

    @Expose()
    @Type(() => ListOrderDto)
    order: ListOrderDto;

}