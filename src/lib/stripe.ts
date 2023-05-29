import Stripe from "stripe";

const stripeServerSide = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15',
});

export { stripeServerSide };

/**
 * Test cards
 * https://stripe.com/docs/testing?numbers-or-method-or-token=card-numbers#cards
 */