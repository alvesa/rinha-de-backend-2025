import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentSummaryController } from './controllers/payments-summary.controller';
import { ConfigModule } from '@nestjs/config';
import { PaymentServiceModule } from './services/payment-service.module';
@Module({
  imports: [
    PaymentServiceModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [PaymentsController, PaymentSummaryController],
})
export class PaymentsModule {}
