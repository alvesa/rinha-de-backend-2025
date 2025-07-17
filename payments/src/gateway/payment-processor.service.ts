import { HttpException, Injectable } from '@nestjs/common';
import { PaymentHealthCheckResponse } from 'src/controllers/dtos/payment-health-check.response';
import { PaymentSummaryResponse } from 'src/controllers/dtos/payment-summary.response';

@Injectable()
export class PaymentProcessorService {
  BASE_URL_PAYMENT_PROCESSOR = process.env.BASE_URL_PAYMENT_PROCESSOR;
  BASE_URL_PAYMENT_PROCESSOR_FALLBACK =
    process.env.BASE_URL_PAYMENT_PROCESSOR_FALLBACK;

  async processPayment({
    correlationId,
    amount,
  }: {
    correlationId: string;
    amount: number;
  }): Promise<any> {
    const response = await fetch(
      `${this.BASE_URL_PAYMENT_PROCESSOR}/payments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correlationId,
          amount,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to process payment: ${response.statusText}`);
    }

    return await response.json();
  }

  async processPaymentFallback({
    correlationId,
    amount,
  }: {
    correlationId: string;
    amount: number;
  }): Promise<any> {
    const response = await fetch(
      `${this.BASE_URL_PAYMENT_PROCESSOR_FALLBACK}/payments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correlationId,
          amount,
        }),
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to process payment: ${response.statusText}`);
    }

    return await response.json();
  }

  async getPaymentSummary(
    from: string,
    to: string,
  ): Promise<PaymentSummaryResponse> {
    const parameters = from && to ? `?from=${from}&to=${to}` : '';

    console.log(
      `url: ${this.BASE_URL_PAYMENT_PROCESSOR}/admin/payments-summary${parameters}`,
    );

    const response = await fetch(
      `${this.BASE_URL_PAYMENT_PROCESSOR}/admin/payments-summary${parameters}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Rinha-Token': '123',
        },
        method: 'GET',
      },
    );
    if (!response.ok) {
      throw new HttpException(
        `Failed to get payment summary: ${response.statusText}`,
        response.status,
      );
    }

    const result: PaymentSummaryResponse = await response.json();
    return result;
  }

  async getPaymentSummaryFallback(
    from: string,
    to: string,
  ): Promise<PaymentSummaryResponse> {
    const parameters = from && to ? `?from=${from}&to=${to}` : '';

    const response = await fetch(
      `${this.BASE_URL_PAYMENT_PROCESSOR_FALLBACK}/admin/payments-summary${parameters}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Rinha-Token': '123',
        },
        method: 'GET',
      },
    );
    if (!response.ok) {
      throw new HttpException(
        `Failed to get payment summary: ${response.statusText}`,
        response.status,
      );
    }

    const result: PaymentSummaryResponse = await response.json();
    return result;
  }

  async paymentHealthCheck(): Promise<PaymentHealthCheckResponse> {
    const response = await fetch(
      `${this.BASE_URL_PAYMENT_PROCESSOR}/service-health`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    );
    if (!response.ok) {
      throw new Error(
        `Failed to check payment service health: ${response.statusText}`,
      );
    }

    const result: { failing: boolean; minResponseTime: number } =
      await response.json();

    return {
      failing: result.failing,
      minResponseTime: result.minResponseTime,
    };
  }

  async paymentHealthCheckFallback(): Promise<PaymentHealthCheckResponse> {
    const response = await fetch(
      `${this.BASE_URL_PAYMENT_PROCESSOR_FALLBACK}/service-health`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    );
    if (!response.ok) {
      throw new Error(
        `Failed to check payment service health: ${response.statusText}`,
      );
    }

    const result: { failing: boolean; minResponseTime: number } =
      await response.json();

    return {
      failing: result.failing,
      minResponseTime: result.minResponseTime,
    };
  }
}
