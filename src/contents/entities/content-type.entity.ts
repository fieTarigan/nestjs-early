import { ContentType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ContentTypeEntity implements ContentType {
  constructor(partial: Partial<ContentTypeEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
