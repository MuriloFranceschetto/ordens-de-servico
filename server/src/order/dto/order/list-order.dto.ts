import { Expose, Type } from "class-transformer";
import { PaymentStatus } from "../../enums/paymentStatus";
import { ListUserDto } from "../../../../src/user/dto/UserList.dto";

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
    open: boolean;

    @Expose()
    paymentStatus: PaymentStatus;

    @Expose()
    @Type(() => ListUserDto)
    client: ListUserDto;
}