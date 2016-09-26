import _ from 'lodash';
import Promise from 'bluebird';
import BaseProvider, {BaseProviderClient} from './BaseProvider';
import mandrill from 'mandrill-api/mandrill';

class MailerProvider extends BaseProvider {
  connect() {
    this.mailer = new mandrill.Mandrill(this.config.MANDRILL_API_KEY);
    return Promise.resolve(null);
  }

  disconnect() {
    this.mailer = null;
    return Promise.resolve(null);
  }

  acquireClient() {
    return Promise.resolve(new MailerProviderClient(this.mailer, this.config));
  }
}

class MailerProviderClient extends BaseProviderClient {
  constructor(mailer, config) {
    super();
    this.mailer = mailer;
    let defaultMessageOptions = {};
    if(config.MANDRILL_TRACKING_DOMAIN) {
      defaultMessageOptions.tracking_domain = config.MANDRILL_TRACKING_DOMAIN;
    }
    if(config.MANDRILL_SIGNING_DOMAIN) {
      defaultMessageOptions.signing_domain = config.MANDRILL_SIGNING_DOMAIN;
    }
    if(config.MANDRILL_RETURN_PATH_DOMAIN) {
      defaultMessageOptions.return_path_domain = config.MANDRILL_RETURN_PATH_DOMAIN;
    }
    if(config.MANDRILL_FROM_EMAIL) {
      defaultMessageOptions.from_email = config.MANDRILL_FROM_EMAIL;
    }
    if(config.MANDRILL_FROM_NAME) {
      defaultMessageOptions.from_name = config.MANDRILL_FROM_NAME;
    }
    this.defaultMandrillOptions = {message: defaultMessageOptions};
  }

  close() {
    this.mailer = null;
    return Promise.resolve(null);
  }

  send(options) {
    return new Promise((resolve, reject) => {
      let mandrillOptions = _.defaultsDeep({
        template_name: options.templateName,
        template_content: [],
        message: {
          subject: options.subject,
          to: options.to,
          from_email: options.fromEmail,
          from_name: options.fromName,
          important: true,
          merge_language: 'handlebars',
          merge_vars: options.mergeVars,
          preserve_recipients: true,
          attachments: options.attachments,
        },
        headers: {}
      }, this.defaultMandrillOptions);
      if(options.replyTo) {
        mandrillOptions.headers['Reply-To'] = options.replyTo;
      }
      this.mailer.messages.sendTemplate(mandrillOptions, (results) => {
        let result = results[0];
        if(result.status === 'rejected' || result.status === 'invalid') {
          console.log('Result: ', result);
          return reject(new Error('Email failed to send'));
        }
        return resolve(result);
      }, (error) => {
        console.log(error);
        return reject(new Error('Email failed to send'));
      });
    });
  }
}

export default MailerProvider
