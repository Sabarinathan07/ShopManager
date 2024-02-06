// import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';
// import { PartialType } from '@nestjs/mapped-types';

// export class createOrderDto {
//     @ApiProperty()
//     @IsNotEmpty()
//     @IsUUID()
//     item: string;

//     @ApiProperty()
//     @IsNotEmpty()
//     @IsNumber({ allowInfinity: false, allowNaN: false })
//     @Min(1)
//     quantity: number;
// }

// export class UpdateOrderDto extends PartialType(createOrderDto) {}
