import { Expose } from "class-transformer";
import { EnvironmentType } from "src/order/enums/environmentType";
import { ListSubserviceDto } from "src/subservice/dto/list-subservice.dto";
import { ListUserDto } from "src/user/dto/UserList.dto";

export class SubserviceOrderDTO {

    @Expose()
    id: string;

    @Expose()
    subservice: ListSubserviceDto;

    @Expose()
    worker: ListUserDto;

    @Expose()
    amount: number;

    @Expose()
    environment: EnvironmentType;

}