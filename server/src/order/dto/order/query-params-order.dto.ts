import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsEnum, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
import * as moment from "moment";

import { PaymentStatus } from "src/order/enums/paymentStatus";
import { PaginationRequestDto } from "src/pipes/pagination-transform.pipe";

export class QueryParamsOrderDto extends PaginationRequestDto {

    @IsOptional()
    @IsString()
    public readonly title?: string;

    @IsOptional()
    @IsUUID()
    public readonly client_id?: string;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        if (!Array.isArray(value)) {
            value = [value]
        }
        return value.map(e => +e);
    })
    @IsEnum(PaymentStatus, { each: true })
    public readonly payment_status?: PaymentStatus[];

    @IsOptional()
    @Transform(({ obj, key }) => obj[key] === 'true' ? true : obj[key] === 'false' ? false : null)
    @IsBoolean()
    public readonly status?: boolean = null;

    @IsOptional()
    @Transform(({ obj, key }) => moment(obj[key]).set('hour', 0).set('minutes', 0).set('seconds', 0).toDate())
    @IsDate()
    public readonly checkout_date_init: Date;

    @IsOptional()
    @Transform(({ obj, key }) => moment(obj[key]).set('hour', 23).set('minutes', 59).set('seconds', 59).toDate())
    @IsDate()
    public readonly checkout_date_end: Date;

}