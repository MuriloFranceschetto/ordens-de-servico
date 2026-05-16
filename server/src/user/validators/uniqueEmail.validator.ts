import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { UserService } from "../user.service";

@Injectable()
@ValidatorConstraint({ async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {

    constructor(private readonly userService: UserService) {
    }

    async validate(value: string, _validationArguments?: ValidationArguments): Promise<boolean> {
        console.log(value)
        const userByEmail = await this.userService.getUserByEmail(value);
        return !userByEmail;
    }

}