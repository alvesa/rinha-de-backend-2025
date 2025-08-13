import { ConsoleLogger, Injectable } from '@nestjs/common';
import { PaymentProcessorService } from 'src/gateway/payment-processor.service';
import { PaymentDto } from './dtos/payment.dto';
import { PaymentHealthCheckResponse } from 'src/controllers/dtos/payment-health-check.response';
import { PaymentSummaryResponse } from 'src/controllers/dtos/payment-summary.response';
import { InjectRepository } from '@nestjs/typeorm';
import { Payments } from 'src/repository/entities/payments.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentProcessorService: PaymentProcessorService,
    private readonly logger: ConsoleLogger,
    @InjectRepository(Payments)
    private paymentRepository: Repository<Payments>,
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
      await this.paymentRepository.insert({
        correlationId,
        amount: Math.round(amount * 100),
        requestedAt: new Date(),
        processor: 'default',
      });

      return {
        message: result.message!,
      };
    }

    const resultFallback =
      await this.paymentProcessorService.processPaymentFallback({
        correlationId,
        amount,
      });

    if (resultFallback.error)
      return { error: true, message: 'Payment processing failed' };

    await this.paymentRepository.insert({
      correlationId,
      amount: Math.round(amount * 100),
      requestedAt: new Date(),
      processor: 'fallback',
    });

    return {
      message: result.message!,
    };
  }

  async getPaymentSummary(
    from?: string,
    to?: string,
  ): Promise<PaymentSummaryResponse> {
    const defaultPaymentSummary =
      await this.paymentProcessorService.getPaymentSummary(from, to);

    const fallbackPaymentSummary =
      await this.paymentProcessorService.getPaymentSummaryFallback(from, to);

    const [myPayments, myPaymentsCount] =
      await this.paymentRepository.findAndCount();

    const grouped = myPayments.reduce(
      (acc, payment) => {
        if (payment.processor === 'default') {
          acc.default = {
            processor: 'default',
            amount: acc.default.amount + payment.amount,
            counter: acc.default.counter + 1,
          };
        } else if (payment.processor === 'fallback') {
          acc.fallback = {
            processor: 'fallback',
            amount: acc.fallback.amount + payment.amount,
            counter: acc.fallback.counter + 1,
          };
        }
        return acc;
      },
      {
        default: {
          processor: 'default',
          amount: 0,
          counter: 0,
        },

        fallback: {
          processor: 'fallback',
          amount: 0,
          counter: 0,
        },
      },
    );

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
        totalRequests: myPaymentsCount,
        totalAmount: grouped.default.amount / 100,
      },
      myFallback: {
        totalRequests: 0,
        totalAmount: 0,
      },
    };
  }

  async paymentHealthCheck(): Promise<PaymentHealthCheckResponse> {
    return this.paymentProcessorService.paymentHealthCheck();
  }
}
