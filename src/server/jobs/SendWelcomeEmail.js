import BaseJob from './BaseJob';

class SendWelcomeEmail extends BaseJob {
  perform(payload) {
    return this.ctx.usersRepository.findById(payload.user_id)
      .then((user) => {
        return this.ctx.usersRepository.update(user, {
          email_verification_token: this.ctx.usersRepository.genUrlSafeBase64(),
          email_verification_token_sent_at: null
        });
      })
      .then((user) => {
        return this.ctx.usersRepository.sendWelcomeEmail(user);
      })
      .then((user) => {
        return this.ctx.usersRepository.update(user, {
          email_verification_token_sent_at: new Date()
        });
      });
  }
}

export default SendWelcomeEmail
