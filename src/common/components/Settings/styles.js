import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';
import {clearfix, checkboxStyles} from '../../lib/mixins';

let actionButton = {
  float: 'right',
  padding: 0,
  lineHeight: '33px',
};

const styles = StyleSheet.create({
  ...checkboxStyles,
  Settings: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '50px 0',
  },
  header: {
    display: 'flex',
  },
  h1: {
    flex: '1 1',
  },
  actions: {
    flex: '1 1',
    textAlign: 'right',
    width: 300,
    ...clearfix,
  },
  editButton: {
    ...actionButton,
    border: 0,
    color: colors.jellyBean,
  },
  cancelButton: {
    ...actionButton,
    color: colors.black35,
    fontWeight: 400,
    marginLeft: '15px',
  },
  saveButton: {
    ...actionButton,
    color: colors.verdigris,
    outline: 'none',
  },
  addNewPaymentMethodButton: {
    padding: 0,
    color: colors.jellyBean,
  },
  subscriptionPlanInput: {
    lineHeight: '20px',
    marginTop: '5px',
    width: '100%',
  },
  changePlanButton: {
    display: 'block',
    padding: 0,
    color: colors.jellyBean,
  },
  input: {
    width: 300,
    borderBottom: `1px solid ${colors.black35}`,
  },
  paymentMethod: {
    display: 'flex',
    margin: '5px 0',
  },
  removePaymentMethodButton: {
    lineHeight: '20px',
    fontSize: '12px',
    color: colors.black35,
  },
  error: {
    color: colors.jellyBean,
    border: `1px solid ${colors.jellyBean}`,
    borderRadius: '3px',
    padding: '8px',
    margin: '0 0 20px',
    textAlign: 'center',
  },
});

export default styles
