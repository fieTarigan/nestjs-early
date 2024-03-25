import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('GanOps')
    .setDescription('The GanOps API description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // const prisma = new PrismaClient({
  //   log: [
  //     {
  //       emit: 'event',
  //       level: 'query',
  //     },
  //     {
  //       emit: 'stdout',
  //       level: 'error',
  //     },
  //     {
  //       emit: 'stdout',
  //       level: 'info',
  //     },
  //     {
  //       emit: 'stdout',
  //       level: 'warn',
  //     },
  //   ],
  // });

  // prisma.$on('query', (e) => {
  //   console.log('Query: ' + e.query);
  //   console.log('Params: ' + e.params);
  //   console.log('Duration: ' + e.duration + ' ms');
  // });

  await app.listen(3000);
}
bootstrap();
