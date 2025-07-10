export class PaymentSummaryResponse {
  from: Date;
  to: Date;
  default: {
    totalRequests: number;
    totalAmount: number;
  };
  fallback: {
    totalRequests: number;
    totalAmount: number;
  };
}
