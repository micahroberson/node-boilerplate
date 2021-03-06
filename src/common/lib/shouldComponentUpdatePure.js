
import shallowEqual from './shallowEqual';

function shouldComponentUpdatePure(nextProps, nextState) {
  return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
}

export default shouldComponentUpdatePure
