import { Content } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ContentTypeEntity } from './content-type.entity';
import { QuestionEntity } from './question.entity';

export class ContentQuizEntity implements Content {
  constructor(data: Partial<ContentQuizEntity>) {
    Object.assign(this, data);

    // if (question) {
    //   console.log('question in entity: ', question);

    //   this.question = question.map((q) => new QuestionEntity(question));
    // }
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  previewUrl: string;

  @ApiProperty()
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

  @ApiProperty({ type: QuestionEntity })
  question: QuestionEntity[];
}
