import { Expose } from "class-transformer";
import { ChargeTypes } from "../charge-type";

export class ListSubserviceDto {

    @Expose()
    active: boolean;

    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    charged_per: ChargeTypes;

    @Expose()
    price: number;

}