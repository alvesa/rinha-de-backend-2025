import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { PaymentRequest } from './dtos/payment.request';
import { PaymentResponse } from './dtos/payment.response';

@Controller('payments')
export class PaymentsController {
  @Post()
  @HttpCode(201)
  processPayment(
    @Body()
    { correlationId, amount }: PaymentRequest,
  ): PaymentResponse {
    return {
      correlationId,
      amount,
    };
  }
}
