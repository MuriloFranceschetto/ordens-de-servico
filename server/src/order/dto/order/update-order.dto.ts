import { IsNotEmpty, IsUUID } from "class-validator";
import { CreateOrderDTO } from "./create-order.dto";

export class UpdateOrderDTO extends CreateOrderDTO {

    @IsNotEmpty({ message: 'The property ID cannot be empty' })
    @IsUUID()
    id: string;

}