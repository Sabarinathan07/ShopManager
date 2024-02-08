import { ApiPropertyOptional } from '@nestjs/swagger';
import { ItemInterface } from '../../item/interfaces/item.interface';
import { UserInterface } from '../../user/interfaces/user.interface';

export class OrderInterface {
    id?: string;
    @ApiPropertyOptional()
    item?: string | ItemInterface;
    @ApiPropertyOptional()
    quantity: number;
    customer?: UserInterface;
    amount?: number;
}
