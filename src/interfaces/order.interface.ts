import { ApiPropertyOptional } from '@nestjs/swagger';

export class OrderInterface {
    @ApiPropertyOptional()
    item: string;
    @ApiPropertyOptional()
    quantity: number;
}
