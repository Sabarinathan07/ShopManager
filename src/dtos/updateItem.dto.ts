import { IsNumber, IsString } from 'class-validator';

export class UpdateItemDto {
    @IsString()
    name: string;

    @IsNumber({ allowInfinity: false, allowNaN: false })
    quantity: number;

    @IsNumber({ allowInfinity: false, allowNaN: false })
    price: number;
}
