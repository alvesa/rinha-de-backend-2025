import { Controller, Get, Query } from '@nestjs/common';
import { PaymentsService } from 'src/services/payments.service';
import { PaymentSummaryResponse } from './dtos/payment-summary.response';

@Controller('payments-summary')
export class PaymentSummaryController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async getPaymentSummary(
    @Query('from') from: Date,
    @Query('to') to: Date,
  ): Promise<PaymentSummaryResponse> {
    return await this.paymentsService.getPaymentSummary(from, to);
  }
}
