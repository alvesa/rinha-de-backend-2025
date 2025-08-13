import { Module } from '@nestjs/common';
import { PaymentsController } from './controllers/payments.controller';
import { PaymentSummaryController } from './controllers/payments-summary.controller';
import { ConfigModule } from '@nestjs/config';
import { PaymentServiceModule } from './services/payment-service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    PaymentServiceModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT!),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [PaymentsController, PaymentSummaryController],
})
export class PaymentsModule {}
