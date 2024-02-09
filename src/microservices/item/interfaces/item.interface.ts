import { ApiPropertyOptional } from '@nestjs/swagger';

export class ItemInterface {
    id: string;
    @ApiPropertyOptional()
    name?: string;
    @ApiPropertyOptional()
    quantity?: number;
    @ApiPropertyOptional()
    price?: number;
}
