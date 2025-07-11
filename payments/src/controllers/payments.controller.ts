import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PaymentRequest } from './dtos/payment.request';
import { PaymentResponse } from './dtos/payment.response';
import { PaymentsService } from 'src/services/payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(201)
  async processPayment(
    @Body()
    { correlationId, amount }: PaymentRequest,
  ): Promise<PaymentResponse> {
    const message = await this.paymentsService.processPayment({
      correlationId,
      amount,
    });
    return message;
  }
}
