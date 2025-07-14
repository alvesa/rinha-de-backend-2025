import { Injectable } from '@nestjs/common';
import { PaymentHealthCheckResponse } from 'src/controllers/dtos/payment-health-check.response';
import { PaymentSummaryResponse } from 'src/controllers/dtos/payment-summary.response';

const BASE_URL = 'http://localhost:8001';

@Injectable()
export class PaymentProcessorService {
  async processPayment({
    correlationId,
    amount,
  }: {
    correlationId: string;
    amount: number;
  }): Promise<any> {
    const response = await fetch(`${BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correlationId,
        amount,
      }),
    });
    if (!response.ok) {
      throw new Error(`Failed to process payment: ${response.statusText}`);
    }

    return await response.json();
  }

  async getPaymentSummary(
    from: string,
    to: string,
  ): Promise<PaymentSummaryResponse> {
    const response = await fetch(
      `${BASE_URL}/admin/payments-summary?from=${from}&to=${to}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Rinha-Token': '123',
        },
        method: 'GET',
      },
    );
    if (!response.ok) {
      throw new Error(`Failed to get payment summary: ${response.statusText}`);
    }

    const result: PaymentSummaryResponse = await response.json();
    return result;
  }

  async paymentHealthCheck(): Promise<PaymentHealthCheckResponse> {
    const response = await fetch(`${BASE_URL}/service-health`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
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
