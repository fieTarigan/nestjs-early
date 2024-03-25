import { Injectable } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { UserContentEntity } from './entities/user-content.entity';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class ContentsService {
  constructor(private prisma: PrismaService) {}

  create(createContentDto: CreateContentDto) {
    const newContent = this.prisma.content.create({ data: createContentDto });
    // console.log('new content: ', newContent);
    return newContent;
  }

  findAll() {
    return this.prisma.content.findMany();
  }

  findOne(id: number) {
    return this.prisma.content.findUnique({ where: { id } });
  }

  update(id: number, updateContentDto: UpdateContentDto) {
    return this.prisma.content.update({
      where: { id },
      data: updateContentDto,
    });
  }

  remove(id: number) {
    return this.prisma.content.delete({ where: { id } });
  }

  async createTransaction(contentId: number, userId: number, price: number) {
    // console.log('create transaction:');
    // console.log('content id: ', contentId);
    // console.log('user id: ', userId);
    // console.log('price: ', price);
    // console.log('secret: ', process.env.SERVER_KEY);

    const keyBase64 = btoa(process.env.SERVER_KEY);
    // console.log('keyBase64: ', keyBase64);

    const options = {
      method: 'POST',
      url: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Basic ${keyBase64}`,
      },
      data: {
        transaction_details: {
          order_id: 'order-id' + Math.round(new Date().getTime() / 1000),
          gross_amount: price,
        },
        credit_card: { secure: true },
        item_details: [
          {
            id: `Content-${contentId}`,
            price: price,
            quantity: 1,
            name: `Content-${contentId}`,
          },
        ],
      },
    };

    let token = '';

    try {
      const response = await axios.request(options);

      // console.log('token out axios:', response.data);
      token = response.data.token;

      if (token !== '') {
        return this.prisma.userContent.create({
          data: {
            contentId,
            userId,
            isPaid: false,
            orderId: response.data.token,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }

    return new UserContentEntity({});
  }

  findOneTransaction(contentId: number, userId: number) {
    return this.prisma.userContent.findFirst({ where: { contentId, userId } });
  }

  payTransaction(id: number) {
    return this.prisma.userContent.update({
      where: { id },
      data: {
        isPaid: true,
      },
    });
  }

  createQuestion(createQuestionDto: CreateQuestionDto) {
    const newQuestion = this.prisma.question.create({
      data: createQuestionDto,
    });
    // console.log('new question: ', newQuestion);
    return newQuestion;
  }

  findAllQuestions(contentId: number) {
    return this.prisma.question.findMany({
      where: {
        contentId,
      },
    });
  }
}
