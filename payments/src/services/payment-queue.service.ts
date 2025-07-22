import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class PaymentQueueService {
  constructor(
    @InjectQueue('payment-processor')
    private paymentProcessorQueue: Queue,
  ) {}

  async addPaymentToQueue(paymentData: {
    correlationId: string;
    amount: number;
  }): Promise<void> {
    await this.paymentProcessorQueue.add(
      'process-payment',
      { ...paymentData, status: 'pending' },
      {
        delay: 0,
        removeOnComplete: true,
        removeOnFail: true,
        jobId: paymentData.correlationId,
      },
    );
  }
}
