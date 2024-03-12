import { ChargeTypes } from "../charge-type";


export class CreateSubserviceDTO {
    active: boolean;
    name: string;
    charged_per: ChargeTypes;
    price: number;
}