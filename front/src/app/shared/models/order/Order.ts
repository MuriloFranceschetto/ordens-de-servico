import { IUser } from "../User";
import { IPaymentOrder } from "./PaymentOrder";

export interface IOrder {
    id?: string;
    title: string;
    description: string;
    datetimeIn: string;
    datetimeOut: string;
    open: boolean;
    paymentStatus: PaymentStatus;
    client: IUser;
    payments: IPaymentOrder[];
}

export class Order implements IOrder {
    id?: string;
    title: string;
    description: string;
    datetimeIn: string;
    datetimeOut: string;
    open: boolean;
    paymentStatus: PaymentStatus;
    client: IUser;
    payments: IPaymentOrder[];
}

export enum PaymentStatus {
    NOT_PAID,
    PARTIALLY_PAID,
    PAID,
}