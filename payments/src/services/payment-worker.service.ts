import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { PaymentsService } from './payments.service';
import { Processor, Process } from '@nestjs/bull';

@Injectable()
@Processor('paymentsQueue')
export class PaymentWorkerService {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Process({
    concurrency: 2,
    name: 'process-payment',
  })
  async processPayment(job: Job): Promise<void> {
    const paymentData = job.data as { correlationId: string; amount: number };
    const result = await this.paymentsService.processPayment({
      correlationId: paymentData.correlationId,
      amount: paymentData.amount,
    });

    if (result.error) {
      await job.moveToFailed({
        message: 'Payment processing failed',
      });
    }
  }
}
