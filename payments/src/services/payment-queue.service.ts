import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class PaymentQueueService {
  constructor(
    @InjectQueue('paymentsQueue')
    private paymentProcessorQueue: Queue,
  ) {}

  async addPaymentToQueue(paymentData: {
    correlationId: string;
    amount: number;
  }): Promise<void> {
    await this.paymentProcessorQueue.add('process-payment', paymentData, {
      delay: 0,
      removeOnFail: true,
      jobId: paymentData.correlationId,
      // attempts: 3,
    });
  }
}
