import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const sig = req.headers["stripe-signature"];
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch (err) { return res.status(400).json({ error: err.message }); }
  const PRICE_PLANS = { [process.env.VITE_STRIPE_PREMIUM_PRICE_ID]: "premium", [process.env.VITE_STRIPE_COACH_PRICE_ID]: "coach" };
  if (["checkout.session.completed", "customer.subscription.updated"].includes(event.type)) {
    const session = event.data.object;
    const userId = session.metadata?.userId || session.client_reference_id;
    const priceId = session.line_items?.data?.[0]?.price?.id || session.items?.data?.[0]?.price?.id;
    const plan = PRICE_PLANS[priceId] || "premium";
    if (userId) await supabase.from("users").update({ subscription_plan: plan }).eq("id", userId);
  }
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;
    const { data: users } = await supabase.from("users").select("id").eq("stripe_subscription_id", sub.id);
    if (users?.[0]) await supabase.from("users").update({ subscription_plan: "free" }).eq("id", users[0].id);
  }
  res.status(200).json({ received: true });
}
