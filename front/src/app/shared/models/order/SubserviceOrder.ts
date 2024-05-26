import { IUser } from "../User";
import { ISubservice } from "../subservice/ISubservice";

export interface ISubserviceOrder {
    id: string;
    subservice: ISubservice;
    worker: IUser;
    amount: number;
    environment: EnvironmentType;
}

export class SubserviceOrder implements ISubserviceOrder {
    public readonly id: string;
    public subservice: ISubservice;
    public worker: IUser;
    public environment: EnvironmentType;
    public quantity: number;
    public amount: number;
}

export enum EnvironmentType {
    INTERNAL,
    EXTERNAL,
}