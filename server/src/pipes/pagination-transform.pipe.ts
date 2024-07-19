import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance, Type } from 'class-transformer';
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

@Injectable()
export class PaginationTransformPipe implements PipeTransform {
    async transform(dto: PaginationRequestDto, { metatype }: ArgumentMetadata) {
        if (!metatype) {
            return dto;
        }
        return plainToInstance(metatype, dto);
    }
}