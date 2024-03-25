import { Question } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ContentEntity } from './content.entity';

export class QuestionEntity implements Question {
  constructor({ content, ...data }: Partial<QuestionEntity>) {
    Object.assign(this, data);

    if (content) {
      this.content = new ContentEntity(content);
    }
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  questionary: string;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  contentId: number;

  @ApiProperty({ type: ContentEntity })
  content: ContentEntity;
}
