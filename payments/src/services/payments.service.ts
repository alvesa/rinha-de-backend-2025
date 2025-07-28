import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { PaymentProcessorService } from 'src/gateway/payment-processor.service';
import { PaymentDto } from './dtos/payment.dto';
import { PaymentHealthCheckResponse } from 'src/controllers/dtos/payment-health-check.response';
import { PaymentSummaryResponse } from 'src/controllers/dtos/payment-summary.response';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentProcessorService: PaymentProcessorService,
    private readonly logger: ConsoleLogger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async processPayment({
    correlationId,
    amount,
  }: {
    correlationId: string;
    amount: number;
  }): Promise<PaymentDto> {
    const result = await this.paymentProcessorService.processPayment({
      correlationId,
      amount,
    });

    if (result) {
      return { message: 'Payment processed successfully ' };
    }

    const resultFallback =
      await this.paymentProcessorService.processPaymentFallback({
        correlationId,
        amount,
      });

    if (!resultFallback)
      return { error: true, message: 'Payment processing failed' };

    return { message: 'Payment processed successfully with fallback' };
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
