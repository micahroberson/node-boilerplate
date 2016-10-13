import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';
import {creditCardIcons} from '../../lib/mixins';

let baseCC = {
  width: '30px',
  height: '20px',
  verticalAlign: 'middle',
  display: 'inline-block',
  marginRight: '6px',
  backgroundSize: 'cover',
};

const styles = StyleSheet.create({
  ...creditCardIcons,
  ccExpiration: {
    marginLeft: '30px',
  },
  ccLastFour: {
    verticalAlign: 'middle',
  },
});

export default styles;
