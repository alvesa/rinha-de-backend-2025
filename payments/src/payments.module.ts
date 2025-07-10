import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsSummaryController } from './controllers/payments-summary.controller';

@Module({
  imports: [],
  controllers: [PaymentsController, PaymentsSummaryController],
  providers: [],
})
export class PaymentsModule {}
