--
-- Teams
--

CREATE TABLE all_teams (
  id TEXT NOT NULL DEFAULT generate_object_id() PRIMARY KEY,
  name TEXT NULL,
  billing_user_id TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,

  FOREIGN KEY (billing_user_id) REFERENCES all_users(id)
);

CREATE VIEW teams AS SELECT * FROM all_teams WHERE deleted_at IS NULL;

CREATE TRIGGER soft_delete_team_trigger
  INSTEAD OF DELETE ON teams
  FOR EACH ROW EXECUTE PROCEDURE soft_delete();

CREATE TRIGGER updated_at_trigger
  BEFORE UPDATE
  ON all_teams
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at_timestamp();

CREATE TABLE logs.all_teams (
  id TEXT NOT NULL DEFAULT generate_object_id() PRIMARY KEY,
  ref_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  action TEXT NOT NULL CHECK (action in ('insert', 'update', 'delete')),
  old_values JSONB,
  new_values JSONB,
  query TEXT
);

CREATE INDEX ON logs.all_teams (ref_id);

CREATE TRIGGER log_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON all_teams
  FOR EACH ROW EXECUTE PROCEDURE log();

--
-- SubscriptionPlans
--

CREATE TABLE all_subscription_plans (
  id TEXT NOT NULL DEFAULT generate_object_id() PRIMARY KEY,
  name TEXT NOT NULL,
  interval TEXT NOT NULL,
  amount_in_cents INT NOT NULL,
  stripe_plan_id TEXT NOT NULL,
  stripe_plan_object JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_all_subscription_plans_deleted_at_stripe_plan_id ON all_subscription_plans (deleted_at, stripe_plan_id);

CREATE VIEW subscription_plans AS SELECT * FROM all_subscription_plans WHERE deleted_at IS NULL;

CREATE TRIGGER soft_delete_subscription_plan_trigger
  INSTEAD OF DELETE ON subscription_plans
  FOR EACH ROW EXECUTE PROCEDURE soft_delete();

CREATE TRIGGER updated_at_trigger
  BEFORE UPDATE
  ON all_subscription_plans
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at_timestamp();

CREATE TABLE logs.all_subscription_plans (
  id TEXT NOT NULL DEFAULT generate_object_id() PRIMARY KEY,
  ref_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  action TEXT NOT NULL CHECK (action in ('insert', 'update', 'delete')),
  old_values JSONB,
  new_values JSONB,
  query TEXT
);

CREATE INDEX ON logs.all_subscription_plans (ref_id);

CREATE TRIGGER log_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON all_subscription_plans
  FOR EACH ROW EXECUTE PROCEDURE log();

--
-- Subscriptions
--

CREATE TABLE all_subscriptions (
  id TEXT NOT NULL DEFAULT generate_object_id() PRIMARY KEY,
  team_id TEXT NOT NULL,
  status TEXT NOT NULL,
  subscription_plan_id TEXT NOT NULL,
  current_period_start TIMESTAMP NULL,
  current_period_end TIMESTAMP NULL,
  stripe_subscription_id TEXT NOT NULL,
  stripe_subscription_object JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,

  FOREIGN KEY (team_id) REFERENCES all_teams(id),
  FOREIGN KEY (subscription_plan_id) REFERENCES all_subscription_plans(id)
);

CREATE INDEX idx_all_subscriptions_deleted_at_stripe_subscription_id ON all_subscriptions (deleted_at, stripe_subscription_id);

CREATE VIEW subscriptions AS SELECT * FROM all_subscriptions WHERE deleted_at IS NULL;

CREATE TRIGGER soft_delete_subscription_trigger
  INSTEAD OF DELETE ON subscriptions
  FOR EACH ROW EXECUTE PROCEDURE soft_delete();

CREATE TRIGGER updated_at_trigger
  BEFORE UPDATE
  ON all_subscriptions
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at_timestamp();

CREATE TABLE logs.all_subscriptions (
  id TEXT NOT NULL DEFAULT generate_object_id() PRIMARY KEY,
  ref_id TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  action TEXT NOT NULL CHECK (action in ('insert', 'update', 'delete')),
  old_values JSONB,
  new_values JSONB,
  query TEXT
);

CREATE INDEX ON logs.all_subscriptions (ref_id);

CREATE TRIGGER log_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON all_subscriptions
  FOR EACH ROW EXECUTE PROCEDURE log();