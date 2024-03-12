import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { Injectable } from "@nestjs/common";
import { UserService } from "../user.service";

@Injectable()
@ValidatorConstraint({ async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {

    constructor(private userService: UserService) {
    }

    async validate(value: string, _validationArguments?: ValidationArguments): Promise<boolean> {
        console.log(value)
        const userByEmail = await this.userService.getUserByEmail(value);
        return !userByEmail;
    }

}

export const UniqueEmail = (validationOptions: ValidationOptions) => {
    return (object: Object, property: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: property,
            options: validationOptions,
            constraints: [],
            validator: UniqueEmailValidator,
        })
    }
}