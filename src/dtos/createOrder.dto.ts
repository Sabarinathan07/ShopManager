import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class createOrderDto {
    @IsNotEmpty()
    @IsUUID()
    item: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}
