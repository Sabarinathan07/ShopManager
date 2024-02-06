// import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';
// import { PartialType } from '@nestjs/mapped-types';

// export class CreateItemDto {
//     @ApiProperty()
//     @IsNotEmpty()
//     @IsString()
//     name: string;

//     @ApiProperty()
//     @IsNotEmpty()
//     @IsNumber({ allowInfinity: false, allowNaN: false })
//     @Min(0)
//     quantity: number;

//     @ApiProperty()
//     @IsNotEmpty()
//     @IsNumber({ allowInfinity: false, allowNaN: false })
//     @Min(0)
//     price: number;
// }

// export class UpdateItemDto extends PartialType(CreateItemDto) {}
