import {
    IsEmail,
    IsIn,
    IsLowercase,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    @IsLowercase()
    @IsIn(['customer', 'shopkeeper'])
    role: string;
}
