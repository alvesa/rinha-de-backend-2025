import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  await app.listen(process.env.PORT ?? 3333).then(() => {
    console.log(
      `Payments service is running on port ${process.env.PORT ?? 3333}`,
    );
  });
}
void bootstrap();
