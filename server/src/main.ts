import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

const SERVER_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(
    // Exclui todos os parâmetros que não estão declarados nos DTO´s;
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    }),
  );
  await app.listen(SERVER_PORT);
  console.log(`Running on port ${SERVER_PORT} -> http://localhost:${SERVER_PORT}`)
}
bootstrap();
