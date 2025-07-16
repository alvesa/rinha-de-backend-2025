import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  await app.listen(Number.parseInt(process.env.PORT!)).then(() => {
    console.log(`Payments service is running on port ${process.env.PORT}`);
  });
}
void bootstrap();
