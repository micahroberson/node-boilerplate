ALTER TABLE all_users ADD COLUMN permissions JSONB NULL;
DROP VIEW users;
CREATE VIEW users AS SELECT * FROM all_users WHERE deleted_at IS NULL;
CREATE TRIGGER soft_delete_user_trigger
  INSTEAD OF DELETE ON users
  FOR EACH ROW EXECUTE PROCEDURE soft_delete();