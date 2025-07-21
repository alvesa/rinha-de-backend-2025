import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentQueueService } from './payment-queue.service';
import { GatewayModule } from 'src/gateway/gateway.module';
import { PaymentWorkerService } from './payment-worker.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
      },
    }),
    BullModule.registerQueue({ name: 'payment-processor' }),
    GatewayModule,
  ],
  controllers: [],
  providers: [PaymentsService, PaymentQueueService, PaymentWorkerService],
  exports: [PaymentsService, PaymentQueueService],
})
export class PaymentServiceModule {}
