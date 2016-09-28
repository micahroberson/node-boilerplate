import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';

const styles = StyleSheet.create({
  authForm: {
    maxWidth: 360,
    margin: '80px auto'
  },
  authFormHeader: {
    fontSize: 22,
    fontWeight: 500,
    lineHeight: '30px',
    margin: '0 0 20px',
    textAlign: 'center'
  },
  input: {
    width: '100%',
    borderBottom: `1px solid ${colors.black35}`
  },
  submitButton: {

  },
  buttonWrapper: {
    textAlign: 'center',
    margin: '30px 0 20px'
  },
  altLinkWrapper: {
    textAlign: 'center',
    padding: '0',
    fontSize: 12
  },
  altLink: {
    color: colors.jellyBean
  },
  error: {
    color: colors.jellyBean,
    textAlign: 'center'
  }
});

export default styles
