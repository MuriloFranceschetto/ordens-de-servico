import { IUser } from "./User";

export interface IOrder {
    id: string;
    title: string;
    datetimeIn: Date;
    datetimeOut: Date;
    open: boolean;
    paymentStatus: PaymentStatus;
    client: IUser;
}

export enum PaymentStatus {
    NOT_PAID,
    PARTIALLY_PAID,
    PAID,
}