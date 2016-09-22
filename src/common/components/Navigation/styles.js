import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';

const styles = StyleSheet.create({
  navigation: {
    padding: '15px 30px',
    fontSize: '14px',
    borderBottom: '1px solid rgba(0,0,0,0.15)'
  },
  homeLink: {
    display: 'inline-block',
    width: 200,
    fontWeight: 700,
    fontSize: 18,
    color: colors.jellyBean
  },
  links: {
    display: 'inline-block',
    width: 'calc(100% - 200px)',
    textAlign: 'right'
  },
  link: {
    display: 'inline-block'
  }
});

export default styles
