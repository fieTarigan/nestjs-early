import { Content } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ContentTypeEntity } from './content-type.entity';
import { Exclude } from 'class-transformer';

export class ContentLimitedEntity implements Content {
  constructor({ contentType, ...data }: Partial<ContentLimitedEntity>) {
    Object.assign(this, data);

    if (contentType) {
      this.contentType = new ContentTypeEntity(contentType);
    }
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  previewUrl: string;

  @ApiProperty()
  @Exclude()
  fullUrl: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  contentTypeId: number;

  @ApiProperty({ type: ContentTypeEntity })
  contentType: ContentTypeEntity;
}
