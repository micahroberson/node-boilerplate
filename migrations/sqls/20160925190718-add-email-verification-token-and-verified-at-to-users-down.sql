DROP view users;

ALTER TABLE all_users DROP COLUMN email_verification_token;
ALTER TABLE all_users DROP COLUMN email_verification_token_sent_at;
ALTER TABLE all_users DROP COLUMN email_verified_at;

ALTER TABLE all_users DROP COLUMN password_reset_token;
ALTER TABLE all_users DROP COLUMN password_reset_token_sent_at;
ALTER TABLE all_users DROP COLUMN password_reset_token_redeemed_at;

CREATE VIEW users AS SELECT * FROM all_users WHERE deleted_at IS NULL;
CREATE TRIGGER soft_delete_user_trigger
  INSTEAD OF DELETE ON users
  FOR EACH ROW EXECUTE PROCEDURE soft_delete();

