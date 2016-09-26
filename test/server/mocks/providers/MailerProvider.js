import Promise from 'bluebird';
import BaseProvider, {BaseProviderClient} from './BaseProvider';

class MailerProvider extends BaseProvider {
  acquireClient() {
    return Promise.resolve(new MailerProviderClient());
  }
}

class MailerProviderClient extends BaseProviderClient {
  send(options) {
    return Promise.resolve({
      email: 'test@example.com',
      status: 'sent'
    });
  }
}

export default MailerProvider
