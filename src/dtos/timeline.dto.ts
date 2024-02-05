import { IsNumber, IsString, Max, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

class TimelineDto {
    @ApiProperty()
    @IsString()
    date: string;

    @IsNumber()
    @ApiProperty()
    @Min(1)
    @Max(12)
    month: number;

    @IsNumber()
    @ApiProperty()
    @Min(1)
    @Max(52)
    week: number;

    @IsNumber()
    @ApiProperty()
    @Min(2023)
    @Max(2026)
    year: number;
}

export class PartialTimeLineDto extends PartialType(TimelineDto) {}
