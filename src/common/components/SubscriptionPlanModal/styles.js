import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';
import {clearfix} from '../../lib/mixins';

const styles = StyleSheet.create({
  subscriptionPlanModal: {},
  subscriptionPlanModalContents: {
    position: 'relative',
    padding: '15px 30px 40px',
  },
  header: {
    marginTop: 0,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: '22px',
    left: '15px',
    padding: 0,
    margin: 0,
    background: 'transparent',
    border: 0,
  },
  closeButtonImg: {
    width: '30px',
    height: '30px',
  },
  continueButton: {
    display: 'block',
    width: '100%',
    padding: '6px 0',
    margin: '15px 0 0',
    backgroundColor: colors.jellyBean,
    color: '#ffffff',
    fontSize: '16px'
  },
  error: {
    display: 'block',
    border: `1px solid ${colors.jellyBean}`,
    color: colors.jellyBean,
    borderRadius: '3px',
    padding: '8px 12px',
    margin: '0 0 15px',
    textAlign: 'center',
  },
  footer: {
    ...clearfix,
    textAlign: 'right',
    margin: '15px 0 0',
  },
});

export default styles;
