import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';

const styles = StyleSheet.create({
  list: {
    position: 'absolute',
    top: '40px',
    right: 'calc(50% - 75px)',
    border: `1px solid ${colors.black15}`,
    borderRadius: '4px',
    padding: '0',
    width: '150px',
    backgroundColor: '#ffffff',
    ':after': {
      bottom: '100%',
      left: '50%',
      border: 'solid transparent',
      content: '" "',
      height: '0',
      width: '0',
      position: 'absolute',
      pointerEvents: 'none',
      borderColor: 'rgba(255, 255, 255, 0)',
      borderBottomColor: '#ffffff',
      borderWidth: '8px',
      marginLeft: '-8px'
    },
    ':before': {
      bottom: '100%',
      left: '50%',
      border: 'solid transparent',
      content: '" "',
      height: '0',
      width: '0',
      position: 'absolute',
      pointerEvents: 'none',
      borderColor: 'transparent',
      borderBottomColor: colors.black15,
      borderWidth: '9px',
      marginLeft: '-9px'
    }
  },
  listElement: {
    ':first-child': {
      marginTop: '8px'
    },
    ':last-child': {
      marginBottom: '8px'
    }
  },
  link: {
    padding: '4px 18px',
    display: 'block',
    textAlign: 'left',
    ':hover': {
      backgroundColor: colors.black06
    }
  },
  button: {
    border: 0,
    outline: 0,
    paddingLeft: 0,
    paddingRight: 0,
    ':active': {
      outline: 0
    }
  }
});

export default styles
