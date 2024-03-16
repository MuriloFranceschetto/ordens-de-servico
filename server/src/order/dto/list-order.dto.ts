import { UserListDto } from "src/user/dto/UserList.dto";
import { PaymentStatus } from "../enums/paymentStatus";

export class ListOrderDTO {
    constructor(
        readonly id: string,
        readonly title: string,
        readonly datetimeIn: Date,
        readonly datetimeOut: Date,
        readonly open: boolean,
        readonly paymentStatus: PaymentStatus,
        readonly client: UserListDto,
    ) { }
}