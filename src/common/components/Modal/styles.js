import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    top: '250px',
    left: 'calc(50% - 280px)',
    width: '560px',
    zIndex: 100,
    borderRadius: '2px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    padding: '0',
    '@media screen and (max-height: 900px)': {
      top: '100px'
    },
  },
  modalOverlay: {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '100%',
    height: '100%',
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'block',
    overflowY: 'scroll',
  }
});

export default styles;
