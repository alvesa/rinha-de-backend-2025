import { Module } from '@nestjs/common';
import { PaymentProcessorService } from './payment-processor.service';

@Module({
  providers: [PaymentProcessorService],
  exports: [PaymentProcessorService],
})
export class GatewayModule {}
