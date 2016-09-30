import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';

const styles = StyleSheet.create({
  navigation: {
    padding: '10px 30px',
    fontSize: '14px',
    borderBottom: '1px solid rgba(0,0,0,0.15)'
  },
  innerContainer: {
    maxWidth: '960px',
    margin: '0 auto'
  },
  homeLink: {
    display: 'inline-block',
    fontWeight: 700,
    fontSize: 18,
    color: colors.jellyBean,
    verticalAlign: 'middle',
    paddingTop: '4px'
  },
  logo: {
    height: '26px'
  },
  links: {
    display: 'inline-block',
    width: 'calc(100% - 200px)',
    textAlign: 'right',
    verticalAlign: 'middle'
  },
  link: {
    display: 'inline-block'
  }
});

export default styles
