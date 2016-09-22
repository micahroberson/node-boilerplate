import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';

const styles = StyleSheet.create({
  signIn: {
    maxWidth: 360,
    margin: '80px auto'
  },
  signInHeader: {
    fontSize: 22,
    fontWeight: 500,
    lineHeight: '30px',
    margin: '0 0 20px',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    border: '1px solid rgba(0,0,0,0.35)',
    padding: '8px 12px',
    margin: '0 0 12px',
    borderRadius: '2px'
  },
  submitButton: {
    float: 'left'
  },
  altLinkWrapper: {
    float: 'right',
    padding: '10px 0',
    fontSize: 12
  },
  altLink: {
    color: colors.tuftsBlue
  },
  error: {
    color: colors.jellyBean,
    textAlign: 'center'
  }
});

export default styles
