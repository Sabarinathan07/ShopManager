import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateItemDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    quantity: number;

    @ApiProperty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    price: number;
}
