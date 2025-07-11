import { Injectable } from '@nestjs/common';
import { PaymentFallbackService } from 'src/gateway/payment-fallback.service';
import { PaymentProcessorService } from 'src/gateway/payment-processor.service';
import { PaymentDto } from './dtos/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentProcessorService: PaymentProcessorService,
    private readonly paymentFallbackService: PaymentFallbackService,
  ) {}

  processPayment({
    correlationId,
    amount,
  }: {
    correlationId: string;
    amount: number;
  }): Promise<PaymentDto> {
    return this.paymentProcessorService.processPayment({
      correlationId,
      amount,
    });
  }

  processPaymentFallback({
    correlationId,
    amount,
  }: {
    correlationId: string;
    amount: number;
  }): Promise<PaymentDto> {
    return this.paymentFallbackService.processPayment({
      correlationId,
      amount,
    });
  }
}
