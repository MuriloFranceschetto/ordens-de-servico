
export abstract class Subservice {

    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly quantity: number;

    constructor(id: string, name: string, price: number, quantity: number) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    getTotalPrice(): number {
        return this.quantity * this.price;
    }
} 