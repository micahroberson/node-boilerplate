import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';
import {clearfix} from '../../lib/mixins';

let actionButton = {
  float: 'right',
  padding: 0,
  lineHeight: '33px',
};

const styles = StyleSheet.create({
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
  input: {
    width: 300,
    borderBottom: `1px solid ${colors.black35}`,
  },
  paymentMethod: {
    display: 'flex',
    margin: '8px 0 0',
  },
  removePaymentMethodButton: {
    lineHeight: '20px',
    fontSize: '12px',
    color: colors.black35,
  },
  checkboxInput: {
    position: 'absolute',
    zIndex: -1,
    opacity: 0,
    ':checked + div': {
      display: 'block',
    },
  },
  checkboxLabel: {
    position: 'relative',
    width: 16,
    height: 16,
    display: 'inline-block',
    cursor: 'pointer',
    margin: '3px 8px 0 0',
    border: `1px solid ${colors.black35}`,
    borderRadius: 2,
    verticalAlign: 'middle',
  },
  disabledCheckboxLabel: {
    border: '1px solid transparent',
    cursor: 'default',
  },
  checkboxCheckmark: {
    display: 'none',
    position: 'absolute',
    top: 2,
    left: 5,
    width: 4,
    height: 9,
    transform: 'rotate(45deg)',
    border: `solid ${colors.blackOlive}`,
    borderWidth: '0 2px 2px 0',
    background: 'transparent',
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
