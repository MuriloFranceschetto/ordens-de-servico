import { ListUserDto } from "../../../../src/user/dto/UserList.dto";
import { PaymentStatus } from "../../enums/paymentStatus";
import { Expose, Type } from "class-transformer";

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

    @Type()
    @Expose()
    client: ListUserDto;
}