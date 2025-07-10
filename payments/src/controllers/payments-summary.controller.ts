import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { PaymentSummaryResponse } from './dtos/payment-summary.response';
import { PaymentSummaryRequest } from './dtos/payment-summary.request';

@Controller('payments-summary')
export class PaymentsSummaryController {
  @Get()
  @HttpCode(200)
  paymentsSummary(
    @Query() { from, to }: PaymentSummaryRequest,
  ): PaymentSummaryResponse {
    return {
      from: from,
      to: to,
      default: {
        totalRequests: 43236,
        totalAmount: 415542345.98,
      },
      fallback: {
        totalRequests: 423545,
        totalAmount: 329347.34,
      },
    };
  }
}
