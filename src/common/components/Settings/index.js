import React from 'react';
import {css} from 'aphrodite/no-important';
import User from '../../models/User';
import userActions from '../../actions/userActions';
import styles from './styles';

class Settings extends React.Component {
  static propTypes = {
    currentUser: React.PropTypes.instanceOf(User)
  };

  static contextTypes = {
    executeAction: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = Object.assign({
      isEditing: false
    }, this.getStateFromProps(props));
  }

  getStateFromProps(props) {
    return {
      email: props.currentUser.email,
      name: props.currentUser.name
    };
  }

  handleOnChangeEmail(e) {
    this.setState({email: e.target.value});
  }

  handleOnChangeName(e) {
    this.setState({name: e.target.value});
  }

  handleOnClickEditButton(e) {
    this.setState({isEditing: true});
  }

  handleOnClickCancelButton(e) {
    this.setState({isEditing: false});
  }

  handleOnClickSaveButton(e) {
    let payload = {};
    let {currentUser} = this.props;
    if(this.state.email !== currentUser.email) {
      payload.email = this.state.email;
    }
    if(this.state.name !== currentUser.name) {
      payload.name = this.state.name;
    }
    this.setState({isEditing: false});
    this.context.executeAction(userActions.update, {
      ...payload,
      id: this.props.currentUser.id
    });
  }

  render() {
    let {currentUser} = this.context;
    let {email, name, isEditing} = this.state;
    let emailInputProps = {
      className: css(styles.input),
      id: 'email',
      type: 'email',
      value: email,
      disabled: !isEditing,
      onChange: this.handleOnChangeEmail.bind(this)
    };
    let nameInputProps = {
      className: css(styles.input),
      id: 'name',
      type: 'text',
      value: name,
      disabled: !isEditing,
      onChange: this.handleOnChangeName.bind(this)
    };
    let editButton = <button className={css(styles.editButton)} onClick={this.handleOnClickEditButton.bind(this)}>Edit</button>;
    let cancelButton = <button className={css(styles.cancelButton)} onClick={this.handleOnClickCancelButton.bind(this)}>Cancel</button>;
    let saveButton = <button className={css(styles.saveButton)} onClick={this.handleOnClickSaveButton.bind(this)}>Save</button>;
    return (
      <div className={css(styles.Settings)}>
        <div className={css(styles.header)}>
          <h1 className={css(styles.h1)}>Settings</h1>
          <div className={css(styles.actions)}>
            {!isEditing ? editButton : null}
            {isEditing ? cancelButton : null}
            {isEditing ? saveButton : null}
          </div>
        </div>
        <fieldset>
          <label htmlFor="name">Your full name</label>
          <input {...nameInputProps} />
        </fieldset>
        <fieldset>
          <label htmlFor="email">Your email address</label>
          <input {...emailInputProps} />
        </fieldset>
      </div>
    );
  }
}

export default Settings;