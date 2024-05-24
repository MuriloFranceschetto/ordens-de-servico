import { Subservice } from "../Subservice";

export class ReferSubservice extends Subservice {
    override getTotalPrice(): number {
        return this.price;
    }
}