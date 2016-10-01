import _ from 'lodash';
import Promise from 'bluebird';
import BaseRepository from './BaseRepository';
import PaymentMethod from '../../common/models/PaymentMethod';

class PaymentMethodsRepository extends BaseRepository {
  static tableName = 'payment_methods';
  static modelClass = PaymentMethod;

  _serializePaymentMethodPlanForSql(paymentMethod) {
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
