DROP VIEW subscriptions;
DROP TABLE all_subscriptions;
DROP TABLE logs.all_subscriptions;

DROP VIEW subscription_plans;
DROP TABLE all_subscription_plans;
DROP TABLE logs.all_subscription_plans;

DROP VIEW payment_methods;
ALTER TABLE all_payment_methods DROP COLUMN team_id;

DROP VIEW teams;
DROP TABLE all_teams;
DROP TABLE logs.all_teams;

DROP VIEW users;
ALTER TABLE all_users DROP COLUMN team_id;
CREATE VIEW users AS SELECT * FROM all_users WHERE deleted_at IS NULL;

DROP TABLE all_payment_methods;
DROP TABLE logs.all_payment_methods;