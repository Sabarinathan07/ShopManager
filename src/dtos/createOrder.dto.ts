import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createOrderDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    item: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}
