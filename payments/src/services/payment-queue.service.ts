import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class PaymentQueueService {
  constructor(
    @InjectQueue('payment-processor')
    private paymentProcessorQueue: Queue,
  ) {}

  async addPaymentToQueue(paymentData: any): Promise<void> {
    await this.paymentProcessorQueue.add('process-payment', paymentData);
  }
}
