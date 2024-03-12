import { ChargeTypes } from "../charge-type";

export class listSubserviceDTO {
    constructor(
        readonly active: boolean,
        readonly id: string,
        readonly name: string,
        readonly charged_per: ChargeTypes,
        readonly price: number,
    ) { }
}