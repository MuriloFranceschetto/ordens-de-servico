import {IUser} from "../User";
import {IOrder} from "./Order";

export interface IPaymentOrder {
    id?: string;
    amount: number;
    type: PaymentType;
    payer: IUser;
    order: IOrder;
    date: string;
}

export enum PaymentType {
    MONEY = 'MONEY',
    CARD = 'CARD',
    PIX = 'PIX',
    CHECK = 'CHECK',
    BANK_SLIP = 'BANK_SLIP',
    INTERNAL = 'INTERNAL',
}

export const PAYMENT_METHOD_OPTIONS: { label: string, value: PaymentType }[] = [
    {label: 'Dinheiro', value: PaymentType.MONEY},
    {label: 'Cartão', value: PaymentType.CARD},
    {label: 'PIX', value: PaymentType.PIX},
    {label: 'Cheque', value: PaymentType.CHECK},
    {label: 'Transferência Bancária', value: PaymentType.BANK_SLIP},
    {label: 'Faturamento Interno', value: PaymentType.INTERNAL},
]
