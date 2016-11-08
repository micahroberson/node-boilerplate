import Base from './Base';

class UserPermissions extends Base {
  constructor(values={}) {
    super(values);

    this.super_user = values.super_user || false;
  }
}

export default UserPermissions;
