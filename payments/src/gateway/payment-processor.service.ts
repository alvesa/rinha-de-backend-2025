import { HttpException, Injectable } from '@nestjs/common';
import { PaymentHealthCheckResponse } from 'src/controllers/dtos/payment-health-check.response';
import { PaymentSummaryDto } from 'src/services/dtos/payment-summary.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface PaymentProcessorResponse {
  message?: string;
  error?: any;
}

@Injectable()
export class PaymentProcessorService {
  constructor(private readonly httpService: HttpService) {}

  BASE_URL_PAYMENT_PROCESSOR = process.env.BASE_URL_PAYMENT_PROCESSOR;
  BASE_URL_PAYMENT_PROCESSOR_FALLBACK =
    process.env.BASE_URL_PAYMENT_PROCESSOR_FALLBACK;

  async processPayment({
    correlationId,
    amount,
  }: {
    correlationId: string;
    amount: number;
  }): Promise<PaymentProcessorResponse> {
    const request = {
      correlationId,
      amount,
      requestedAt: new Date(),
    };
    try {
      const result = await firstValueFrom(
        this.httpService.post(
          `${this.BASE_URL_PAYMENT_PROCESSOR}/payments`,
          request,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return result.data as PaymentProcessorResponse;
    } catch (error) {
      return {
        error,
      };
    }
  }

  async processPaymentFallback({
    correlationId,
    amount,
  }: {
    correlationId: string;
    amount: number;
  }): Promise<PaymentProcessorResponse> {
    const request = JSON.stringify({
      correlationId,
      amount,
      requestedAt: new Date(),
    });

    try {
      const result = await firstValueFrom(
        this.httpService.post(
          `${this.BASE_URL_PAYMENT_PROCESSOR_FALLBACK}/payments`,
          request,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return result.data as PaymentProcessorResponse;
    } catch (error) {
      return {
        error,
      };
    }
  }

  async getPaymentSummary(
    from?: string,
    to?: string,
  ): Promise<PaymentSummaryDto> {
    const parameters = from && to ? `?from=${from}&to=${to}` : '';

    const response = await firstValueFrom(
      this.httpService.get(
        `${this.BASE_URL_PAYMENT_PROCESSOR}/admin/payments-summary${parameters}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Rinha-Token': '123',
          },
        },
      ),
    );
    if (!response.data) {
      throw new HttpException(
        `Failed to get payment summary: ${response.statusText}`,
        response.status,
      );
    }

    const result: PaymentSummaryDto = response.data;
    return result;
  }

  async getPaymentSummaryFallback(
    from?: string,
    to?: string,
  ): Promise<PaymentSummaryDto> {
    const parameters = from && to ? `?from=${from}&to=${to}` : '';

    const response = await firstValueFrom(
      this.httpService.get(
        `${this.BASE_URL_PAYMENT_PROCESSOR_FALLBACK}/admin/payments-summary${parameters}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Rinha-Token': '123',
          },
        },
      ),
    );
    if (!response.data) {
      throw new HttpException(
        `Failed to get payment summary: ${response.statusText}`,
        response.status,
      );
    }

    const result: PaymentSummaryDto = response.data;
    return result;
  }

  async paymentHealthCheck(): Promise<PaymentHealthCheckResponse> {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.BASE_URL_PAYMENT_PROCESSOR}/admin/service-health`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );
    if (!response.data) {
      throw new Error(
        `Failed to check payment service health: ${response.statusText}`,
      );
    }

    const result: { failing: boolean; minResponseTime: number } = response.data;

    return {
      failing: result.failing,
      minResponseTime: result.minResponseTime,
    };
  }

  async paymentHealthCheckFallback(): Promise<PaymentHealthCheckResponse> {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.BASE_URL_PAYMENT_PROCESSOR_FALLBACK}/admin/service-health`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );
    if (!response.data) {
      throw new Error(
        `Failed to check payment service health: ${response.statusText}`,
      );
    }

    const result: { failing: boolean; minResponseTime: number } = response.data;

    return {
      failing: result.failing,
      minResponseTime: result.minResponseTime,
    };
  }
}
