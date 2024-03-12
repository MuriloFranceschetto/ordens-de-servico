export interface ISubservice {
    active: boolean;
    id: string;
    name: string;
    charged_per: ChargeTypes;
    price: number;
}

export enum ChargeTypes {
    HOUR = 'HR',
    KG = 'KG',
    KM = 'KM',
    UNITY = 'UN',
    REFER = 'RF',
}

export const CHARGE_TYPES_OPTIONS: { label: string, value: ChargeTypes }[] = [
    { label: 'Hora', value: ChargeTypes.HOUR },
    { label: 'Kilograma', value: ChargeTypes.KG },
    { label: 'Quilômetro', value: ChargeTypes.KM },
    { label: 'Unidade', value: ChargeTypes.UNITY },
    { label: 'Repasse', value: ChargeTypes.REFER },
]