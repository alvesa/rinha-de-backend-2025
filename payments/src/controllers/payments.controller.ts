import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PaymentRequest } from './dtos/payment.request';
import { PaymentResponse } from './dtos/payment.response';
import { PaymentsService } from 'src/services/payments.service';
import { PaymentHealthCheckResponse } from './dtos/payment-health-check.response';
import { PaymentQueueService } from 'src/services/payment-queue.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paymentWorkerService: PaymentQueueService,
  ) {}

  @Post()
  @HttpCode(201)
  async processPayment(
    @Body()
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    // const message = await this.paymentsService.processPayment({
    //   correlationId: request.correlationId,
    //   amount: request.amount,
    // });
    // return message;

    await this.paymentWorkerService.addPaymentToQueue({
      correlationId: request.correlationId,
      amount: request.amount,
    });

    return {
      message: 'Payment request has been added to the processing queue.',
    };
  }

  async paymentHealthCheck(): Promise<PaymentHealthCheckResponse> {
    return this.paymentsService.paymentHealthCheck();
  }
}
