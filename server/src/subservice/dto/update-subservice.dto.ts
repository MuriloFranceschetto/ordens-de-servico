import { ChargeTypes } from "../charge-type";

export class UpdateSubserviceDTO {
    active: boolean;
    name: string;
    charged_per: ChargeTypes;
    price: number;
}