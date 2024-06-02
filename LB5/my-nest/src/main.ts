import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from "cors-ts"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cors({
      origin: ['http://localhost:3000','http://localhost:8080'] , 
      optionsSuccessStatus: 200,
    })
  )
  await app.listen(3001);
}

bootstrap();
