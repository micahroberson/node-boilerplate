ALTER TABLE all_users ADD COLUMN email_verification_token TEXT NULL;
ALTER TABLE all_users ADD COLUMN email_verification_token_sent_at TIMESTAMP NULL;
ALTER TABLE all_users ADD COLUMN email_verified_at TIMESTAMP NULL;

ALTER TABLE all_users ADD COLUMN password_reset_token TEXT NULL;
ALTER TABLE all_users ADD COLUMN password_reset_token_sent_at TIMESTAMP NULL;
ALTER TABLE all_users ADD COLUMN password_reset_token_redeemed_at TIMESTAMP NULL;

CREATE INDEX idx_all_users_deleted_at_email_verification_token ON all_users (deleted_at, email_verification_token);
CREATE INDEX idx_all_users_deleted_at_password_reset_token ON all_users (deleted_at, password_reset_token);

DROP view users;
CREATE VIEW users AS SELECT * FROM all_users WHERE deleted_at IS NULL;
CREATE TRIGGER soft_delete_user_trigger
  INSTEAD OF DELETE ON users
  FOR EACH ROW EXECUTE PROCEDURE soft_delete();

