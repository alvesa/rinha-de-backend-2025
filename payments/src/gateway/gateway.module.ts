import { ConsoleLogger, Module } from '@nestjs/common';
import { PaymentProcessorService } from './payment-processor.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [PaymentProcessorService, ConsoleLogger],
  exports: [PaymentProcessorService],
})
export class GatewayModule {}
