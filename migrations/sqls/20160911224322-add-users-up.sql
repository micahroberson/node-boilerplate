-- ObjectId generation function
-- Only used for default id values in log tables at this time.
-- From https://gist.github.com/jamarparris/6100413
CREATE OR REPLACE FUNCTION generate_object_id() RETURNS varchar AS $$
DECLARE
  time_component bigint;
  machine_id int := FLOOR(random() * 16777215);
  process_id int;
  seq_id bigint := FLOOR(random() * 16777215);
  result varchar:= '';
BEGIN
  SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp())) INTO time_component;
  SELECT pg_backend_pid() INTO process_id;

  result := result || lpad(to_hex(time_component), 8, '0');
  result := result || lpad(to_hex(machine_id), 6, '0');
  result := result || lpad(to_hex(process_id), 4, '0');
  result := result || lpad(to_hex(seq_id), 6, '0');
  RETURN result;
END;
$$ LANGUAGE PLPGSQL;

-- updated_at timestamp trigger
CREATE OR REPLACE FUNCTION set_updated_at_timestamp() RETURNS TRIGGER AS
$$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log all of the things
-- Assumes log table exists with a jsonb type column valled 'values'
CREATE OR REPLACE FUNCTION log() RETURNS TRIGGER AS $log_trigger$
  BEGIN
    IF (TG_OP = 'INSERT') THEN
      EXECUTE format('INSERT INTO logs.' || TG_TABLE_NAME || ' (ref_id, action, new_values, query) VALUES ($1.id, ''insert'', row_to_json($1)::jsonb, CURRENT_QUERY())')
      USING NEW;
      RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
      EXECUTE format('INSERT INTO logs.' || TG_TABLE_NAME || ' (ref_id, action, new_values, old_values, query) VALUES ($1.id, ''update'', row_to_json($1)::jsonb, row_to_json($2)::jsonb, CURRENT_QUERY())')
      USING NEW, OLD;
      RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
      EXECUTE format('INSERT INTO logs.' || TG_TABLE_NAME || ' (ref_id, action, old_values, query) VALUES ($1.id, ''delete'', row_to_json($1)::jsonb, CURRENT_QUERY())')
      USING OLD;
      RETURN OLD;
    END IF;
  END;
$log_trigger$ LANGUAGE plpgsql;

-- Assumes a `deleted_at` field of type `TIMESTAMP` exists
CREATE OR REPLACE FUNCTION soft_delete() RETURNS trigger AS $$
  DECLARE
    command text := ' SET deleted_at = current_timestamp WHERE id = $1';
  BEGIN
    EXECUTE 'UPDATE ' || TG_TABLE_NAME || command USING OLD.id;
    RETURN NULL;
  END;
$$ LANGUAGE plpgsql;

-- Create separate schema for log tables;
CREATE SCHEMA IF NOT EXISTS logs;

CREATE TABLE all_users (
  id TEXT NOT NULL DEFAULT generate_object_id() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL UNIQUE,
  encrypted_password TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_all_users_deleted_at_email ON all_users (deleted_at, email);

CREATE VIEW users AS SELECT * FROM all_users WHERE deleted_at IS NULL;

CREATE TRIGGER soft_delete_user_trigger
  INSTEAD OF DELETE ON users
  FOR EACH ROW EXECUTE PROCEDURE soft_delete();

CREATE TRIGGER updated_at_trigger
  BEFORE UPDATE
  ON all_users
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at_timestamp();

CREATE TABLE logs.all_users (
  id TEXT NOT NULL DEFAULT generate_object_id() PRIMARY KEY,
  ref_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  action TEXT NOT NULL CHECK (action in ('insert', 'update', 'delete')),
  old_values JSONB,
  new_values JSONB,
  query TEXT
);

CREATE INDEX ON logs.all_users (ref_id);

CREATE TRIGGER log_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON all_users
  FOR EACH ROW EXECUTE PROCEDURE log();