import "reflect-metadata";
import helmet from "helmet";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./modules/app.module.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const origins = process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()) ?? [];

  app.setGlobalPrefix("v1");
  app.use(helmet());
  app.enableCors({
    origin: origins.length > 0 ? origins : false,
    credentials: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port, "0.0.0.0");
}

void bootstrap();
