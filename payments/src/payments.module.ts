import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentsSummaryController } from './controllers/payments-summary.controller';
import { GatewayModule } from './gateway/gateway.module';
import { PaymentsService } from './services/payments.service';

@Module({
  imports: [GatewayModule],
  controllers: [PaymentsController, PaymentsSummaryController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
