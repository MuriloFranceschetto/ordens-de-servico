import { IUser } from "../User";
import { ISubservice } from "../subservice/ISubservice";
import { IOrder } from "./Order";

export interface ISubserviceOrder {
    id: string;
    subservice: ISubservice;
    worker: IUser;
    amount: number;
    quantity: number;
    environment: EnvironmentType;
    order: IOrder;
}

export class SubserviceOrder implements ISubserviceOrder {
    public readonly id: string;
    public subservice: ISubservice;
    public worker: IUser;
    public environment: EnvironmentType;
    public quantity: number;
    public amount: number;
    public order: IOrder;
}

export enum EnvironmentType {
    INTERNAL,
    EXTERNAL,
}

export const ENVIRONMENT_OPTIONS: { label: string, value: EnvironmentType }[] = [
    { label: 'Interno (Oficina)', value: EnvironmentType.INTERNAL },
    { label: 'Externo (Campo)', value: EnvironmentType.EXTERNAL },
]

