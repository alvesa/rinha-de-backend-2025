import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PaymentRequest } from './dtos/payment.request';
import { PaymentResponse } from './dtos/payment.response';
import { PaymentsService } from 'src/services/payments.service';
import { PaymentHealthCheckResponse } from './dtos/payment-health-check.response';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(201)
  async processPayment(
    @Body()
    request: PaymentRequest,
  ): Promise<PaymentResponse> {
    const message = await this.paymentsService.processPayment({
      correlationId: request.correlationId,
      amount: request.amount,
    });
    return message;
  }

  async paymentHealthCheck(): Promise<PaymentHealthCheckResponse> {
    return this.paymentsService.paymentHealthCheck();
  }
}
