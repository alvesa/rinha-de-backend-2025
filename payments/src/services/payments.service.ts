import { Injectable } from '@nestjs/common';
import { PaymentFallbackService } from 'src/gateway/payment-fallback.service';
import { PaymentProcessorService } from 'src/gateway/payment-processor.service';
import { PaymentDto } from './dtos/payment.dto';
import { PaymentHealthCheckResponse } from 'src/controllers/dtos/payment-health-check.response';
import { PaymentSummaryResponse } from 'src/controllers/dtos/payment-summary.response';

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

  async processPaymentFallback({
    correlationId,
    amount,
  }: {
    correlationId: string;
    amount: number;
  }): Promise<PaymentDto> {
    return await this.paymentFallbackService.processPayment({
      correlationId,
      amount,
    });
  }

  async getPaymentSummary(
    from: string,
    to: string,
  ): Promise<PaymentSummaryResponse> {
    return await this.paymentProcessorService.getPaymentSummary(from, to);
  }

  async paymentHealthCheck(): Promise<PaymentHealthCheckResponse> {
    return this.paymentProcessorService.paymentHealthCheck();
  }
}
