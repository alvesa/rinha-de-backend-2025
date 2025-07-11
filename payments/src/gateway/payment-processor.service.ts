import { Injectable } from '@nestjs/common';

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
}
