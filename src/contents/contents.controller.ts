import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  Request,
  ConflictException,
  BadGatewayException,
} from '@nestjs/common';
import { ContentsService } from './contents.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ContentEntity } from './entities/content.entity';
import { JwtAuthGuard, MyAuthGuard } from 'src/auth/jwt-auth.guard';
import { ContentLimitedEntity } from './entities/content-limited.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UserContentEntity } from './entities/user-content.entity';
import { QuestionEntity } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ContentQuizEntity } from './entities/content-quiz.entity';

@Controller('contents')
@ApiTags('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ContentEntity })
  async create(@Body() createContentDto: CreateContentDto) {
    return new ContentEntity(
      await this.contentsService.create(createContentDto),
    );
  }

  @Get()
  @ApiOkResponse({ type: ContentLimitedEntity, isArray: true })
  async findAll() {
    const contents = await this.contentsService.findAll();
    return contents.map((content) => new ContentLimitedEntity(content));
  }

  @Get(':id')
  @UseGuards(MyAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ContentEntity || ContentLimitedEntity })
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // console.log('user:', req.user);

    const content = await this.contentsService.findOne(id);
    if (!content) {
      throw new NotFoundException(`Content with ${id} does not exist.`);
    }

    if (!req.user) {
      return new ContentLimitedEntity(content);
    } else {
      const transaction = await this.contentsService.findOneTransaction(
        id,
        req.user.id,
      );

      // console.log('transaction: ', transaction);

      if (!transaction) {
        return new ContentLimitedEntity(content);
      } else {
        if (transaction.isPaid) {
          if (content.contentTypeId !== 3) {
            return new ContentEntity(content);
          }

          const questions = await this.contentsService.findAllQuestions(
            content.id,
          );

          console.log('questions: ', questions);

          return new ContentEntity(content);
        } else {
          return new ContentLimitedEntity(content);
        }
      }
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ContentEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return new ContentEntity(
      await this.contentsService.update(id, updateContentDto),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ContentEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ContentEntity(await this.contentsService.remove(id));
  }

  @Post('book')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: String })
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ) {
    const contentId = createTransactionDto.contentId;

    const content = await this.contentsService.findOne(contentId);
    if (!content) {
      throw new NotFoundException(`Content with ${contentId} does not exist.`);
    }

    const transaction = await this.contentsService.findOneTransaction(
      contentId,
      req.user.id,
    );

    if (transaction) {
      throw new ConflictException(
        `Transaction with content id ${contentId} already exist.`,
      );
    }

    const newTransaction = new UserContentEntity(
      await this.contentsService.createTransaction(
        contentId,
        req.user.id,
        content.price,
      ),
    );

    // console.log('newTransaction: ', newTransaction);
    // console.log('newTransaction: ', newTransaction.id);

    if (newTransaction.id) {
      return `Booking sukses. Link: https://app.sandbox.midtrans.com/snap/v3/redirection/${newTransaction.orderId}`;
    } else {
      throw new BadGatewayException('Booking gagal.');
    }
  }

  @Post('pay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: String })
  async payTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req,
  ) {
    const contentId = createTransactionDto.contentId;

    const transaction = await this.contentsService.findOneTransaction(
      contentId,
      req.user.id,
    );

    // console.log('want to paid Transaction: ', transaction);

    if (!transaction) {
      throw new NotFoundException(
        `Transaction with content id ${contentId} does not exist.`,
      );
    }
    if (transaction.isPaid) {
      throw new ConflictException(
        `Transaction with ${transaction.id} already paid.`,
      );
    }

    const newTransaction = new UserContentEntity(
      await this.contentsService.payTransaction(transaction.id),
    );

    // console.log('paid Transaction: ', newTransaction);

    return 'Pembayaran sukses.';
  }

  @Post('question')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: QuestionEntity })
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    const contentId = createQuestionDto.contentId;

    const content = await this.contentsService.findOne(contentId);
    if (!content) {
      throw new NotFoundException(`Content with ${contentId} does not exist.`);
    }
    if (content.contentTypeId !== 3) {
      throw new ConflictException(`Content with ${contentId} is not quiz.`);
    }

    return new QuestionEntity(
      await this.contentsService.createQuestion(createQuestionDto),
    );
  }
}
