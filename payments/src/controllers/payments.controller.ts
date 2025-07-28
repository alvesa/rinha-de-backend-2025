import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { PaymentRequest } from './dtos/payment.request';
import { PaymentsService } from 'src/services/payments.service';
import { PaymentQueueService } from 'src/services/payment-queue.service';
import { Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paymentWorkerService: PaymentQueueService,
  ) {}

  @Post()
  @HttpCode(201)
  async processPayment(
    @Body()
    request: PaymentRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    if (!request || !request.correlationId || !request.amount) {
      throw new BadRequestException('Invalid request');
    }

    await this.paymentWorkerService.addPaymentToQueue({
      correlationId: request.correlationId,
      amount: request.amount,
    });

    response.status(HttpStatus.CREATED).send();
  }
}
