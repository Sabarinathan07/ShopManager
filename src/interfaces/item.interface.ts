import { ApiPropertyOptional } from "@nestjs/swagger";

export class ItemInterface {
    @ApiPropertyOptional()
    name?: string;
    @ApiPropertyOptional()
    quantity?: number;
    @ApiPropertyOptional()
    price?: number;
}
