import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';
import {clearfix, checkboxStyles} from '../../lib/mixins';

const styles = StyleSheet.create({
  ...checkboxStyles,
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
  subscriptionPlanList: {
    padding: '15px 0',
  },
  subscriptionPlan: {
    margin: '0 0 10px',
  },
  subscriptionPlanSummary: {
    display: 'inline-block',
    lineHeight: '20px',
    verticalAlign: 'middle',
    marginTop: '3px',
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
  cancelButton: {
    display: 'block',
    color: colors.black35,
    textAlign: 'center',
    fontWeight: 400,
    margin: '10px auto 0',
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
