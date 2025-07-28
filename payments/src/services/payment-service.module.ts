import { BullModule } from '@nestjs/bull';
import { ConsoleLogger, Module } from '@nestjs/common';
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
    BullModule.registerQueue({
      name: 'paymentsQueue',
      prefix: 'rinha:payments',
    }),
    GatewayModule,
  ],
  controllers: [],
  providers: [
    PaymentsService,
    PaymentQueueService,
    PaymentWorkerService,
    ConsoleLogger,
  ],
  exports: [PaymentsService, PaymentQueueService],
})
export class PaymentServiceModule {}
