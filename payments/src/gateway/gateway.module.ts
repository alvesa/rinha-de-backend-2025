import { Module } from '@nestjs/common';
import { PaymentProcessorService } from './payment-processor.service';
import { PaymentFallbackService } from './payment-fallback.service';

@Module({
  providers: [PaymentProcessorService, PaymentFallbackService],
  exports: [PaymentProcessorService, PaymentFallbackService],
})
export class GatewayModule {}
