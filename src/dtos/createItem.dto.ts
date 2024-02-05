import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    price: number;
}
