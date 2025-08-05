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

  const { priceId } = request.data;
  const YOUR_DOMAIN = "http://localhost:5173"; 

  try {
    logger.info(`Tworzenie sesji dla użytkownika: ${request.auth.uid} z ceną: ${priceId}`);
    
    const session = await stripe.checkout.sessions.create({
      // ✅ ZMIANA: Usunęliśmy 'p24' z listy. Pozostaje tylko 'card'.
      payment_method_types: ["card"], 
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: request.auth.uid,
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    logger.info(`Sesja utworzona pomyślnie: ${session.id}`);
    return { id: session.id };
  } catch (error) {
    logger.error("Błąd podczas tworzenia sesji Stripe:", error);
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
    const subscription = await stripe.subscriptions.retrieve(session.subscription);

    const userRef = admin.firestore().collection("users").doc(userId);
    await userRef.set({
      subscription: {
        status: "active",
        priceId: subscription.items.data[0].price.id,
        customerId: session.customer,
        current_period_end: new Date(subscription.current_period_end * 1000),
      }
    }, { merge: true });
    logger.info(`Subskrypcja zaktualizowana dla: ${userId}`);
  }

  res.status(200).send();
});