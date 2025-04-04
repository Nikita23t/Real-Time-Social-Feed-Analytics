import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true, // Удаляет лишние поля
//     forbidNonWhitelisted: true, // Бросает ошибку, если есть лишние поля
//     transform: true, // Автоматически приводит типы к нужным
//     disableErrorMessages: false // Включает сообщения об ошибках
// }));

  await app.listen(PORT, () => { console.log(`server start on port ${PORT}`)});

}
bootstrap();
