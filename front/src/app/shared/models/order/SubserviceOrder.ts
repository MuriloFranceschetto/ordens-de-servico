import { ISubservice } from "../subservice/ISubservice";

export class SubserviceOrder {
    public readonly id?: string = null;
    public subservice: ISubservice;
    public workedTime: string;
    public quantity: number;
    public price: number;
}