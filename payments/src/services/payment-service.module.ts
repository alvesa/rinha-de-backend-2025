import { BullModule } from '@nestjs/bull';
import { ConsoleLogger, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentQueueService } from './payment-queue.service';
import { GatewayModule } from 'src/gateway/gateway.module';
import { PaymentWorkerService } from './payment-worker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payments } from 'src/repository/entities/payments.entity';

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
    TypeOrmModule.forFeature([Payments]),
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
