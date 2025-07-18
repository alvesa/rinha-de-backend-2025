import { Injectable } from '@nestjs/common';
import { PaymentProcessorService } from 'src/gateway/payment-processor.service';
import { PaymentDto } from './dtos/payment.dto';
import { PaymentHealthCheckResponse } from 'src/controllers/dtos/payment-health-check.response';
import { PaymentSummaryResponse } from 'src/controllers/dtos/payment-summary.response';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentProcessorService: PaymentProcessorService,
  ) {}

  async processPayment({
    correlationId,
    amount,
  }: {
    correlationId: string;
    amount: number;
  }): Promise<PaymentDto> {
    try {
      await this.paymentProcessorService.processPayment({
        correlationId,
        amount,
      });

      return { message: 'Payment processed successfully' };
    } catch (error: any) {
      console.error(`Error processing payment: ${error}`);

      await this.paymentProcessorService.processPaymentFallback({
        correlationId,
        amount,
      });

      return { message: 'Payment processed successfully with fallback' };
    }
  }

  async getPaymentSummary(
    from: string,
    to: string,
  ): Promise<PaymentSummaryResponse> {
    const defaultPaymentSummary =
      await this.paymentProcessorService.getPaymentSummary(from, to);

    const fallbackPaymentSummary =
      await this.paymentProcessorService.getPaymentSummaryFallback(from, to);

    return {
      default: {
        totalRequests: defaultPaymentSummary.totalRequests,
        totalAmount: defaultPaymentSummary.totalAmount,
      },
      fallback: {
        totalRequests: fallbackPaymentSummary.totalRequests,
        totalAmount: fallbackPaymentSummary.totalAmount,
      },
    };
  }

  async paymentHealthCheck(): Promise<PaymentHealthCheckResponse> {
    return this.paymentProcessorService.paymentHealthCheck();
  }
}
