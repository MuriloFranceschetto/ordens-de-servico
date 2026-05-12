import {Transform} from "class-transformer";
import {IsArray, IsDate, IsEnum, IsOptional, IsString, IsUUID} from "class-validator";
import moment from "moment";

import {PaymentStatus} from "src/order/enums/PaymentStatus";
import {OrderStatus} from "../../enums/OrderStatus";
import {PaginationRequestDto} from "../../../shared/pipes/pagination-transform.pipe";

export class QueryParamsOrderDto extends PaginationRequestDto {

    @IsOptional()
    @IsString()
    public readonly title?: string;

    @IsOptional()
    @IsUUID()
    public readonly client_id?: string;

    @IsOptional()
    @IsArray()
    @Transform(({value}) => {
        if (!Array.isArray(value)) {
            value = [value]
        }
        return value.map(e => +e);
    })
    @IsEnum(PaymentStatus, {each: true})
    public readonly payment_status?: PaymentStatus[];

    @IsOptional()
    @IsArray()
    @Transform(({value}) => {
        if (!Array.isArray(value)) {
            value = [value]
        }
        return value;
    })
    @IsEnum(OrderStatus, {each: true})
    public readonly order_status?: OrderStatus[];

    @IsOptional()
    @Transform(({obj, key}) => moment(obj[key]).set('hour', 0).set('minutes', 0).set('seconds', 0).toDate())
    @IsDate()
    public readonly checkout_date_init: Date;

    @IsOptional()
    @Transform(({obj, key}) => moment(obj[key]).set('hour', 23).set('minutes', 59).set('seconds', 59).toDate())
    @IsDate()
    public readonly checkout_date_end: Date;

}