import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';
import {creditCardIcons, mediaQueries} from '../../lib/mixins';

const baseInputStyle = {
  backgroundColor: '#ffffff',
  border: `1px solid ${colors.black15}`,
  borderRadius: '3px',
  padding: '0 15px'
};

const styles = StyleSheet.create({
  ...creditCardIcons,
  paymentMethodModal: {},
  paymentMethodModalContents: {
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
    border: `1px solid ${colors.jellyBean}`,
    color: colors.jellyBean,
    borderRadius: '3px',
    margin: '0 0 15px',
    textAlign: 'center',
  },
  paymentMethodButton: {

  },
  checkbox: {

  },
  checkboxLabel: {

  },
  removeButton: {

  },
  newPaymentMethodButton: {

  },
  ccNumberInput: {
    ...baseInputStyle,
    width: '100%',
    margin: '0 0 10px',
  },
  ccExpMonthInput: {
    ...baseInputStyle,
    width: '105px',
    margin: '0 10px 0 0',
  },
  ccExpYearInput: {
    ...baseInputStyle,
    width: '105px',
    margin: '0 10px 0 0',
  },
  ccCvcInput: {
    ...baseInputStyle,
    width: '120px'
  },
  form: {

  },
  inputContainer: {
    position: 'relative',

  },
  footer: {
    margin: '15px 0 0',
  },
  securityMessage: {
    color: colors.black35,
  }
});

export default styles;
