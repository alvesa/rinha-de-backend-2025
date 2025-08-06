import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { PaymentProcessorService } from 'src/gateway/payment-processor.service';
import { PaymentDto } from './dtos/payment.dto';
import { PaymentHealthCheckResponse } from 'src/controllers/dtos/payment-health-check.response';
import { PaymentSummaryResponse } from 'src/controllers/dtos/payment-summary.response';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

const DEFAULT_TOTAL_REQUESTS_CACHE_KEY = 'rinha:payments:default:totalRequests';
const DEFAULT_TOTAL_AMOUNT_CACHE_KEY = 'rinha:payments:default:totalAmount';
const FALLBACK_TOTAL_REQUESTS_CACHE_KEY =
  'rinha:payments:fallback:totalRequests';
const FALLBACK_TOTAL_AMOUNT_CACHE_KEY = 'rinha:payments:fallback:totalAmount';

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

    if (!result.error) {
      const [totalRequests, totalAmount] = await this.cacheManager.mget<number>(
        [DEFAULT_TOTAL_REQUESTS_CACHE_KEY, DEFAULT_TOTAL_AMOUNT_CACHE_KEY],
      );

      await this.cacheManager.mset<number>([
        {
          key: DEFAULT_TOTAL_REQUESTS_CACHE_KEY,
          value: (totalRequests || 0) + 1,
        },
        {
          key: DEFAULT_TOTAL_AMOUNT_CACHE_KEY,
          value: (totalAmount || 0) + amount,
        },
      ]);

      return { message: result.message! };
    }

    const resultFallback =
      await this.paymentProcessorService.processPaymentFallback({
        correlationId,
        amount,
      });

    if (resultFallback.error)
      return { error: true, message: 'Payment processing failed' };

    const [totalRequestsFallback, totalAmountFallback] =
      await this.cacheManager.mget<number>([
        FALLBACK_TOTAL_REQUESTS_CACHE_KEY,
        FALLBACK_TOTAL_AMOUNT_CACHE_KEY,
      ]);

    await this.cacheManager.mset<number>([
      {
        key: FALLBACK_TOTAL_REQUESTS_CACHE_KEY,
        value: (totalRequestsFallback || 0) + 1,
      },
      {
        key: FALLBACK_TOTAL_AMOUNT_CACHE_KEY,
        value: (totalAmountFallback || 0) + amount,
      },
    ]);

    return {
      message: result.message!,
    };
  }

  async getPaymentSummary(
    from: string,
    to: string,
  ): Promise<PaymentSummaryResponse> {
    const defaultPaymentSummary =
      await this.paymentProcessorService.getPaymentSummary(from, to);

    const fallbackPaymentSummary =
      await this.paymentProcessorService.getPaymentSummaryFallback(from, to);

    const [
      myDefaultPaymentTotal,
      myDefaultTotalAmount,
      myFallbackPaymentTotal,
      myFallbackTotalAmount,
    ] = await this.cacheManager.mget<number>([
      DEFAULT_TOTAL_REQUESTS_CACHE_KEY,
      DEFAULT_TOTAL_AMOUNT_CACHE_KEY,
      FALLBACK_TOTAL_REQUESTS_CACHE_KEY,
      FALLBACK_TOTAL_AMOUNT_CACHE_KEY,
    ]);

    return {
      default: {
        totalRequests: defaultPaymentSummary.totalRequests,
        totalAmount: defaultPaymentSummary.totalAmount,
      },
      fallback: {
        totalRequests: fallbackPaymentSummary.totalRequests,
        totalAmount: fallbackPaymentSummary.totalAmount,
      },
      myDefault: {
        totalRequests: myDefaultPaymentTotal!,
        totalAmount: myDefaultTotalAmount!,
      },
      myFallback: {
        totalRequests: myFallbackPaymentTotal!,
        totalAmount: myFallbackTotalAmount!,
      },
    };
  }

  async paymentHealthCheck(): Promise<PaymentHealthCheckResponse> {
    return this.paymentProcessorService.paymentHealthCheck();
  }
}
