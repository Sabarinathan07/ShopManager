import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserInterface } from '../../user/interfaces/';
import { ItemInterface } from '../../item/interfaces/';

export class OrderInterface {
    id?: string;
    @ApiPropertyOptional()
    item?: string | ItemInterface;
    @ApiPropertyOptional()
    quantity: number;
    customer?: UserInterface;
    amount?: number;
}
