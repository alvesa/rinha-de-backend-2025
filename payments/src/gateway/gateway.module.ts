import { ConsoleLogger, Module } from '@nestjs/common';
import { PaymentProcessorService } from './payment-processor.service';

@Module({
  providers: [PaymentProcessorService, ConsoleLogger],
  exports: [PaymentProcessorService],
})
export class GatewayModule {}
