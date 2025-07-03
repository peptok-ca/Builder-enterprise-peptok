import { logger } from "../config/logger.js";

export class PaymentService {
  async processPayment(paymentData) {
    logger.info("Processing mock payment", paymentData);

    return {
      id: `payment_${Date.now()}`,
      status: "completed",
      amount: paymentData.amount,
      currency: paymentData.currency || "USD",
      transactionId: `txn_${Date.now()}`,
    };
  }

  async getPaymentHistory(userId) {
    logger.info(`Getting payment history for user: ${userId}`);

    return [
      {
        id: "payment_1",
        amount: 150,
        currency: "USD",
        status: "completed",
        date: new Date(),
        description: "Mentorship session",
      },
    ];
  }

  async refundPayment(paymentId) {
    logger.info(`Refunding payment: ${paymentId}`);

    return {
      id: paymentId,
      status: "refunded",
      refundDate: new Date(),
    };
  }
}

export const paymentService = new PaymentService();
