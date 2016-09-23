import {StyleSheet} from 'aphrodite/no-important';
import colors from '../../lib/colors';
import {clearfix} from '../../lib/mixins';

let actionButton = {
  float: 'right',
  padding: 0,
  lineHeight: '50px'
};

const styles = StyleSheet.create({
  Settings: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '50px 0'
  },
  header: {
    display: 'flex'
  },
  h1: {
    flex: '1 1'
  },
  actions: {
    flex: '1 1',
    textAlign: 'right',
    width: 300,
    ...clearfix
  },
  editButton: {
    ...actionButton,
    border: 0,
    color: colors.jellyBean
  },
  cancelButton: {
    ...actionButton,
    color: colors.black35,
    fontWeight: 400,
    marginLeft: '15px'
  },
  saveButton: {
    ...actionButton,
    color: colors.verdigris
  },
  input: {
    width: 300,
    borderBottom: `1px solid ${colors.black35}`
  }
});

export default styles
