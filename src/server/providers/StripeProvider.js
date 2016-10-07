import Promise from 'bluebird';
import BaseProvider, {BaseProviderClient} from './BaseProvider';
import Stripe from 'stripe';

class StripeProvider extends BaseProvider {
  connect() {
    this.stripe = new Stripe(this.config.STRIPE_SECRET_KEY);
    return Promise.resolve(null);
  }

  disconnect() {
    this.stripe = null;
    return Promise.resolve(null);
  }

  acquireClient() {
    return Promise.resolve(new StripeProviderClient(this.stripe, this.config));
  }
}

class StripeProviderClient extends BaseProviderClient {
  constructor(stripe, config) {
    super();
    this.stripe = stripe;

    this.customers = this.stripe.customers;
    this.charges = this.stripe.charges;
    this.events = this.stripe.events;
    this.plans = this.stripe.plans;
    this.subscriptions = this.stripe.subscriptions;
    this.tokens = this.stripe.tokens;
  }

  close() {
    this.stripe = null;
    return Promise.resolve(null);
  }
}

export default StripeProvider
