CREATE TABLE user_sessions (
  id TEXT NOT NULL PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES all_users(id)
);

CREATE INDEX idx_user_sessions_id_user_id ON user_sessions (id, user_id);

CREATE TRIGGER updated_at_trigger
  BEFORE UPDATE
  ON user_sessions
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at_timestamp();

CREATE TABLE logs.user_sessions (
  id TEXT NOT NULL DEFAULT generate_object_id() PRIMARY KEY,
  ref_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  action TEXT NOT NULL CHECK (action in ('insert', 'update', 'delete')),
  old_values JSONB,
  new_values JSONB,
  query TEXT
);

CREATE INDEX ON logs.user_sessions (ref_id);

CREATE TRIGGER log_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON user_sessions
  FOR EACH ROW EXECUTE PROCEDURE log();