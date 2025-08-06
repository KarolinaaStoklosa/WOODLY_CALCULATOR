const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
admin.initializeApp();

exports.createStripeCheckout = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Musisz być zalogowany.");
  }

  const { priceId, mode } = request.data;
  const YOUR_DOMAIN = "http://localhost:5174"; 

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: mode === 'subscription' ? ["card"] : ["card", "p24"],
      mode: mode,
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: request.auth.uid,
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });
    return { id: session.id };
  } catch (error) {
    logger.error("Błąd tworzenia sesji Stripe:", error);
    throw new HttpsError("internal", `Wystąpił błąd serwera: ${error.message}`);
  }
});

exports.stripeWebhook = onRequest(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
  } catch (err) {
    logger.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id;

    if (!userId) {
      logger.error("Brak userId w sesji Stripe!");
      return res.status(400).send("Brak userId.");
    }

    const userRef = admin.firestore().collection("users").doc(userId);

    try {
      // ✅ ZMIANA: Logika jest teraz rozdzielona dla obu typów płatności
      if (session.mode === 'subscription') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await userRef.update({
          subscription: {
            status: "active",
            priceId: subscription.items.data[0].price.id,
            customerId: session.customer,
            current_period_end: new Date(subscription.current_period_end * 1000),
            accessUntil: null // Czyścimy dostęp jednorazowy
          }
        });
        logger.info(`Subskrypcja cykliczna aktywowana dla: ${userId}`);

      } else if (session.mode === 'payment') {
        const accessEndDate = new Date();
        accessEndDate.setDate(accessEndDate.getDate() + 30);
        await userRef.update({
          subscription: {
            status: "active",
            // W trybie 'payment', priceId jest niedostępny w tym evencie,
            // ale nie jest nam potrzebny do weryfikacji.
            accessUntil: accessEndDate, // Zapisujemy datę wygaśnięcia dostępu
            current_period_end: null // Czyścimy dane subskrypcji
          }
        });
        logger.info(`Dostęp jednorazowy aktywowany dla: ${userId} do ${accessEndDate.toISOString()}`);
      }
    } catch (err) {
      logger.error("Błąd podczas aktualizacji profilu użytkownika:", err);
      return res.status(500).send("Błąd serwera wewnętrznego.");
    }
  }

  res.status(200).send();
});