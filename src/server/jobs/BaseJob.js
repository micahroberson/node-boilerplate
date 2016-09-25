class BaseJob {
  constructor(options={}) {
    this.ctx = options.ctx;
  }

  perform(payload) {
    throw new Error('Must be implemented!');
  }
}

export default BaseJob