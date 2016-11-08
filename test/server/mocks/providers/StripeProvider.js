import Promise from 'bluebird';
import BaseProvider, {BaseProviderClient} from './BaseProvider';

class StripeProvider extends BaseProvider {
  acquireClient() {
    return Promise.resolve(new StripeProviderClient());
  }
}

class StripeProviderClient extends BaseProviderClient {
  constructor(stripe, config) {
    super(stripe, config);

    this.customers = {
      create() {
        return Promise.resolve(StripeCustomerObject);
      },
      createSource() {
        return Promise.resolve(StripeCardObject);
      },
      update() {
        return Promise.resolve(StripeCustomerObject);
      }
    };
  }
}

export default StripeProvider

const StripeCustomerObject = {
  "id": "cus_9K5xLKIUUWsnrB",
  "object": "customer",
  "account_balance": 0,
  "created": 1475721483,
  "currency": "usd",
  "default_source": "card_191Rln2eZvKYlo2CxGzlfk5W",
  "delinquent": false,
  "description": "Sample user",
  "discount": null,
  "email": "syble@example.com",
  "livemode": false,
  "metadata": {
  },
  "shipping": null,
  "sources": {
    "object": "list",
    "data": [
      {
        "id": "card_191Rln2eZvKYlo2CxGzlfk5W",
        "object": "card",
        "address_city": null,
        "address_country": null,
        "address_line1": null,
        "address_line1_check": null,
        "address_line2": null,
        "address_state": null,
        "address_zip": null,
        "address_zip_check": null,
        "brand": "Visa",
        "country": "US",
        "customer": "cus_9K5xLKIUUWsnrB",
        "cvc_check": "pass",
        "dynamic_last4": null,
        "exp_month": 10,
        "exp_year": 2017,
        "funding": "credit",
        "last4": "1881",
        "metadata": {
        },
        "name": null,
        "tokenization_method": null
      }
    ],
    "has_more": false,
    "total_count": 1,
    "url": "/v1/customers/cus_9K5xLKIUUWsnrB/sources"
  },
  "subscriptions": {
    "object": "list",
    "data": [

    ],
    "has_more": false,
    "total_count": 0,
    "url": "/v1/customers/cus_9K5xLKIUUWsnrB/subscriptions"
  }
};

const StripeCardObject = {
  "id": "card_191Rqf2eZvKYlo2C4046Wvm4",
  "object": "card",
  "address_city": null,
  "address_country": null,
  "address_line1": null,
  "address_line1_check": null,
  "address_line2": null,
  "address_state": null,
  "address_zip": "12345",
  "address_zip_check": "pass",
  "brand": "Visa",
  "country": "US",
  "customer": "cus_9K5xLKIUUWsnrB",
  "cvc_check": "pass",
  "dynamic_last4": null,
  "exp_month": 11,
  "exp_year": 2017,
  "funding": "credit",
  "last4": "4242",
  "metadata": {
  },
  "name": "you@email.com",
  "tokenization_method": null
};
