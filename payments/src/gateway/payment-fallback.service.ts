import { Injectable } from '@nestjs/common';
import { PaymentDto } from 'src/services/dtos/payment.dto';

const BASE_URL = 'http://localhost:8002';

@Injectable()
export class PaymentFallbackService {
  async processPayment({
    correlationId,
    amount,
  }: {
    correlationId: string;
    amount: number;
  }): Promise<PaymentDto> {
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

    const result = await response.json();
    return result as PaymentDto;
  }

  async getPaymentSummary(from: string, to: string): Promise<any> {
    const response = await fetch(
      `${BASE_URL}/payments-summary?from=${from}&to=${to}`,
    );
    if (!response.ok) {
      throw new Error(`Failed to get payment summary: ${response.statusText}`);
    }

    return await response.json();
  }
}
