import BaseJob from './BaseJob';

class SendPasswordResetEmail extends BaseJob {
  perform(payload) {
    return this.ctx.usersRepository.findById(payload.user_id, true)
      .bind(this)
      .then(this.updatePasswordResetToken)
      .then(this.sendResetPasswordEmail)
      .then(this.updateResetPasswordTokenSentAt);
  }

  updatePasswordResetToken(user) {
    return this.ctx.usersRepository.update(user, {
      password_reset_token: this.ctx.usersRepository.genUrlSafeBase64(),
      password_reset_token_sent_at: null,
      password_reset_token_redeemed_at: null
    });
  }

  updateResetPasswordTokenSentAt(user) {
    return this.ctx.usersRepository.update(user, {
      password_reset_token_sent_at: new Date()
    });
  }

  sendResetPasswordEmail(user) {
    return this.ctx.usersRepository.sendResetPasswordEmail(user)
      .then((result) => {
        return user;
      });
  }
}

export default SendPasswordResetEmail
