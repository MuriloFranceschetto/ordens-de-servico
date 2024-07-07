import { Expose } from "class-transformer";
import { ChargeTypes } from "../charge-type";
import { IsBoolean, IsEnum, IsNotEmpty, IsString, ValidateIf } from "class-validator";


export class CreateSubserviceDTO {

    @Expose()
    @IsNotEmpty({ message: 'The property active cannot be empty' })
    @IsBoolean({ message: 'The property open must be a boolean' })
    active: boolean;

    @Expose()
    @IsNotEmpty({ message: 'The property name cannot be empty' })
    @IsString()
    name: string;

    @Expose()
    @IsNotEmpty({ message: 'The property charged_per cannot be empty' })
    @IsEnum(ChargeTypes)
    charged_per: ChargeTypes;

    @Expose()
    @ValidateIf((obj: CreateSubserviceDTO) => {
        return obj.charged_per !== ChargeTypes.REFER;
    })
    @IsNotEmpty({ message: 'The property price cannot be empty' })
    price: number;

}