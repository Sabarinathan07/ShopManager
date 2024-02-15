import { ApiPropertyOptional } from '@nestjs/swagger';

export class TeamInterface {
    id: string;

    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    members?: string[];
}
