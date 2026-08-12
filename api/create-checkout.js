import Stripe from "stripe";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { priceId, userId, userEmail } = req.body;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: userEmail,
    client_reference_id: userId,
    success_url: `${process.env.VITE_APP_URL}/Dashboard?upgrade=success`,
    cancel_url: `${process.env.VITE_APP_URL}/Pricing`,
    metadata: { userId, userEmail },
  });
  res.status(200).json({ url: session.url });
}
