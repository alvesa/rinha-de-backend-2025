import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentSummaryController } from './controllers/payments-summary.controller';
import { ConfigModule } from '@nestjs/config';
import { PaymentServiceModule } from './services/payment-service.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
@Module({
  imports: [
    PaymentServiceModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          useKeyPrefix: false,
          stores: [
            createKeyv(
              `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            ),
          ],
        };
      },
    }),
  ],
  controllers: [PaymentsController, PaymentSummaryController],
})
export class PaymentsModule {}
