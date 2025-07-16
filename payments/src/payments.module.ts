import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { GatewayModule } from './gateway/gateway.module';
import { PaymentsService } from './services/payments.service';
import { PaymentSummaryController } from './controllers/payments-summary.controller';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    GatewayModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [PaymentsController, PaymentSummaryController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
