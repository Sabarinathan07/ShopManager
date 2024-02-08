import { ApiPropertyOptional } from '@nestjs/swagger';
import { ItemInterface } from './item.interface';
import { UserInterface } from './user.interface';

export class OrderInterface {
    id?: string;
    @ApiPropertyOptional()
    item?: string | ItemInterface;
    @ApiPropertyOptional()
    quantity: number;
    customer?: UserInterface;
    amount?: number;
}
