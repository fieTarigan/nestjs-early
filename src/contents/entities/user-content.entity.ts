import { UserContent } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ContentEntity } from './content.entity';
import { UserEntity } from 'src/users/entities/user.entity';

export class UserContentEntity implements UserContent {
  constructor({ content, user, ...data }: Partial<UserContentEntity>) {
    Object.assign(this, data);

    if (content) {
      this.content = new ContentEntity(content);
    }

    if (user) {
      this.user = new UserEntity(user);
    }
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  isPaid: boolean;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  contentId: number;

  @ApiProperty({ type: ContentEntity })
  content: ContentEntity;

  @ApiProperty()
  userId: number;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;
}
