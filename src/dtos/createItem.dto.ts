import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateItemDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    quantity: number;

    @IsNotEmpty()
    @IsNumber({ allowInfinity: false, allowNaN: false })
    price: number;
}
