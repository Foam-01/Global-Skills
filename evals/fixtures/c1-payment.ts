// src/payments.ts — Express + Prisma, PromptPay via Opn Payments (Omise)
router.post("/checkout", requireAuth, async (req, res) => {
  const { orderId, amount } = req.body;                 // amount in baht from the app, e.g. 149.5
  const charge = await omise.charges.create({
    amount: amount * 100, currency: "thb",
    source: { type: "promptpay" },
    metadata: { orderId },
  });
  res.json({ qr: charge.source.scannable_code.image.download_uri, chargeId: charge.id });
});

// The app opens this after the customer finishes paying in their banking app
router.get("/payment/return", async (req, res) => {
  await prisma.order.update({ where: { id: String(req.query.orderId) }, data: { status: "paid" } });
  res.redirect("/thank-you");
});

router.post("/webhooks/omise", async (req, res) => {
  const event = req.body;
  if (event.key === "charge.complete") {
    await prisma.order.update({ where: { id: event.data.metadata.orderId }, data: { status: "paid" } });
    await sendReceiptEmail(event.data.metadata.orderId);
  }
  res.sendStatus(200);
});
