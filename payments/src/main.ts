import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { ConsoleLogger } from '@nestjs/common';

const logger = new ConsoleLogger();

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  await app.listen(Number.parseInt(process.env.PORT!)).then(() => {
    logger.log(`Payments service is running on port ${process.env.PORT}`);
  });

  app.useLogger(logger);
}
void bootstrap();
