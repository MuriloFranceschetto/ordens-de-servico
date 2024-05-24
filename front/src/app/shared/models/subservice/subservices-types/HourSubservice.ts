import { Subservice } from "../Subservice";

export class HourSubservice extends Subservice {

    hours: string;

    override getTotalPrice(): number {
        console.log(this.hours);
        return 0;
    }
}