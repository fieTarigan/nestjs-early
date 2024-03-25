import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  questionary: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  answer: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  contentId: number;
}
