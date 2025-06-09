import express from "express";
import { paymentService } from "../services/PaymentService.js";
import { authMiddleware } from "../middleware/auth.js";
import { logger } from "../config/logger.js";

const router = express.Router();

// Get subscription tiers
router.get("/tiers", async (req, res) => {
  try {
    const tiers = paymentService.getSubscriptionTiers();
    res.json({
      success: true,
      data: tiers,
    });
  } catch (error) {
    logger.error("Error fetching subscription tiers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription tiers",
    });
  }
});

// Create payment intent
router.post("/intent", authMiddleware(), async (req, res) => {
  try {
    const { amount, currency = "USD", metadata = {} } = req.body;
    const userId = req.user.id;

    const paymentIntent = await paymentService.createPaymentIntent(
      amount,
      currency,
      { ...metadata, userId },
    );

    res.json({
      success: true,
      data: paymentIntent,
    });
  } catch (error) {
    logger.error("Error creating payment intent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment intent",
    });
  }
});

// Create customer
router.post("/customer", authMiddleware(), async (req, res) => {
  try {
    const { email, name } = req.body;
    const userId = req.user.id;

    const customer = await paymentService.createCustomer(email, name, {
      userId,
    });

    res.json({
      success: true,
      data: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
    });
  } catch (error) {
    logger.error("Error creating customer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create customer",
    });
  }
});

// Create subscription
router.post("/subscription", authMiddleware(), async (req, res) => {
  try {
    const { customerId, priceId, metadata = {} } = req.body;
    const userId = req.user.id;

    const subscription = await paymentService.createSubscription(
      customerId,
      priceId,
      { ...metadata, userId },
    );

    res.json({
      success: true,
      data: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        clientSecret:
          subscription.latest_invoice?.payment_intent?.client_secret,
      },
    });
  } catch (error) {
    logger.error("Error creating subscription:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create subscription",
    });
  }
});

// Upgrade subscription
router.post("/subscription/:id/upgrade", authMiddleware(), async (req, res) => {
  try {
    const { id: subscriptionId } = req.params;
    const { newPriceId } = req.body;

    const upgrade = await paymentService.upgradeSubscription(
      subscriptionId,
      newPriceId,
    );

    res.json({
      success: true,
      data: upgrade,
    });
  } catch (error) {
    logger.error("Error upgrading subscription:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upgrade subscription",
    });
  }
});

// Purchase additional seats
router.post("/seats", authMiddleware(), async (req, res) => {
  try {
    const { quantity, currentTierId } = req.body;
    const companyId = req.user.companyId; // Assuming user has companyId

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID required for seat purchase",
      });
    }

    const purchase = await paymentService.purchaseAdditionalSeats(
      companyId,
      quantity,
      currentTierId,
    );

    res.json({
      success: true,
      data: purchase,
    });
  } catch (error) {
    logger.error("Error purchasing additional seats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to purchase additional seats",
    });
  }
});

// Calculate upgrade cost
router.post("/upgrade-cost", authMiddleware(), async (req, res) => {
  try {
    const { currentTierId, newTierId, remainingDays = 30 } = req.body;

    const cost = paymentService.calculateUpgradeCost(
      currentTierId,
      newTierId,
      remainingDays,
    );

    res.json({
      success: true,
      data: { cost },
    });
  } catch (error) {
    logger.error("Error calculating upgrade cost:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate upgrade cost",
    });
  }
});

// Get usage statistics
router.get("/usage/:customerId", authMiddleware(), async (req, res) => {
  try {
    const { customerId } = req.params;

    // Only allow users to access their own usage stats or admins
    if (req.user.stripeCustomerId !== customerId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const usage = await paymentService.getUsageStats(customerId);

    res.json({
      success: true,
      data: usage,
    });
  } catch (error) {
    logger.error("Error fetching usage stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch usage statistics",
    });
  }
});

// Stripe webhook endpoint
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature = req.headers["stripe-signature"];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!signature || !endpointSecret) {
        return res.status(400).json({
          success: false,
          message: "Missing signature or webhook secret",
        });
      }

      await paymentService.handleWebhook(req.body, signature, endpointSecret);

      res.json({ received: true });
    } catch (error) {
      logger.error("Webhook error:", error);
      res.status(400).json({
        success: false,
        message: "Webhook handling failed",
      });
    }
  },
);

export default router;
