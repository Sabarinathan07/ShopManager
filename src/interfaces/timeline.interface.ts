import { ApiPropertyOptional } from '@nestjs/swagger';

export class TimelineInterface {
    @ApiPropertyOptional()
    date?: string;
    @ApiPropertyOptional()
    month?: number;
    @ApiPropertyOptional()
    week?: number;
    @ApiPropertyOptional()
    year?: number;
}
