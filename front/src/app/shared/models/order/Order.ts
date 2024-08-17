import { IUser } from "../User";
import { IPaymentOrder } from "./PaymentOrder";
import { ISubserviceOrder, SubserviceOrder } from "./SubserviceOrder";

export interface IOrder {
    id?: string;
    title: string;
    description: string;
    datetimeIn: string;
    datetimeOut: string;
    closed: boolean;
    paymentStatus: PaymentStatus;
    client: IUser;
    payments: IPaymentOrder[];
    subservices: ISubserviceOrder[];
}

export class Order implements IOrder {
    id?: string;
    title: string;
    description: string;
    datetimeIn: string;
    datetimeOut: string;
    closed: boolean;
    paymentStatus: PaymentStatus;
    client: IUser;

    payments: IPaymentOrder[];
    subservices: SubserviceOrder[];
}

export enum PaymentStatus {
    NOT_PAID,
    PARTIALLY_PAID,
    PAID,
}