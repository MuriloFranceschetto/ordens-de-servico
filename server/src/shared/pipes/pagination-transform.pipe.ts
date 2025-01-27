import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationRequestDto {

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    public readonly page?: number = 0;

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    public readonly limit?: number = 10;
}