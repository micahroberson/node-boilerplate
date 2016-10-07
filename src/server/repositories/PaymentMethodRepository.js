import _ from 'lodash';
import Promise from 'bluebird';
import BaseRepository from './BaseRepository';
import PaymentMethod from '../../common/models/PaymentMethod';
import {ParametersInvalidError} from '../lib/errors/APIError';

class PaymentMethodsRepository extends BaseRepository {
  static tableName = 'payment_methods';
  static modelClass = PaymentMethod;

  create(paymentMethod) {
    if(!paymentMethod.stripe_token_id) {throw new Error('stripe_token_id must be provided');}
    if(!paymentMethod.team) {throw new Error('team must be assigned');}
    if(!paymentMethod.team.stripe_customer_id) {throw new Error('team must have a stripe_customer_id');}
    return this.stripe.customers.createSource(
      paymentMethod.team.stripe_customer_id,
      {source: paymentMethod.stripe_token_id}
    ).then((stripeCardObject) => {
      delete paymentMethod.stripe_token_id;
      paymentMethod.brand = stripeCardObject.brand;
      paymentMethod.last_four = stripeCardObject.last4;
      paymentMethod.expiration_month = stripeCardObject.exp_month;
      paymentMethod.expiration_year = stripeCardObject.exp_year;
      paymentMethod.stripe_card_id = stripeCardObject.id;
      paymentMethod.stripe_card_object = stripeCardObject;
      return super.create(paymentMethod);
    })
    .catch((error) => {
      if(error.type === 'StripeCardError') {
        throw new ParametersInvalidError({message: error.message});
      }
      throw error;
    });
  }

  _serializePaymentMethodForSql(paymentMethod) {
    return {
      id: paymentMethod.id,
      team_id: paymentMethod.team_id,
      brand: paymentMethod.brand,
      last_four: paymentMethod.last_four,
      expiration_month: paymentMethod.expiration_month,
      expiration_year: paymentMethod.expiration_year,
      stripe_card_id: paymentMethod.stripe_card_id,
      stripe_card_object: JSON.stringify(_.cloneDeep(paymentMethod.stripe_card_object))
    };
  }
}

export default PaymentMethodsRepository
