import BaseJob from './BaseJob';

class SendWelcomeEmail extends BaseJob {
  perform(payload) {
    return this.ctx.usersRepository.findById(payload.user_id)
      .then((user) => {
        console.log('SENDING A WELCOME EMAIL FOR: ', user.id);
        return user;
      });
  }
}

export default SendWelcomeEmail
