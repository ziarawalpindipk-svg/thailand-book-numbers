const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe payment link
router.post("/stripe", async (req, res) => {
  try {
    const { totalAmount, currency } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency || "usd",
            product_data: { name: "Thai Books Offer" },
            unit_amount: Math.round(totalAmount * 100), // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/offer-success",
      cancel_url: "http://localhost:3000/cart",
    });

    res.json({ paymentLink: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create PayPal payment link
router.post("/paypal", async (req, res) => {
  try {
    const paypal = require("@paypal/checkout-server-sdk");
    const environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_SECRET
    );
    const client = new paypal.core.PayPalHttpClient(environment);

    const { totalAmount, currency } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency || "USD",
            value: totalAmount.toString(),
          },
        },
      ],
    });

    const order = await client.execute(request);
    const approveLink = order.result.links.find((l) => l.rel === "approve");
    res.json({ paymentLink: approveLink ? approveLink.href : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
