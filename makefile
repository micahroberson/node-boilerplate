.PHONY: test
# Arg extraction
ifeq (migrate,$(firstword $(MAKECMDGOALS)))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(RUN_ARGS):;@:)
endif

db-setup:
	createdb node_boilerplate
	createdb node_boilerplate_test
	psql -c "CREATE USER node_boilerplate WITH PASSWORD 'password'"
	psql -c "CREATE USER node_boilerplate_test WITH PASSWORD 'password'"
	psql -c "GRANT ALL PRIVILEGES ON DATABASE node_boilerplate TO node_boilerplate"
	psql -c "GRANT ALL PRIVILEGES ON DATABASE node_boilerplate_test TO node_boilerplate_test"

install:
	@echo "Installing dependencies"
	@npm install

run-development:
	@node_modules/.bin/pm2 start ./config/pm2/development.json
restart-development:
	@node_modules/.bin/pm2 restart ./config/pm2/development.json
stop-development:
	@node_modules/.bin/pm2 delete ./config/pm2/development.json
logs-development:
	@node_modules/.bin/pm2 logs $(RUN_ARGS)

test-setup:
	@BABEL_ENV=server NODE_ENV=test ./node_modules/.bin/db-migrate reset
	@BABEL_ENV=server NODE_ENV=test ./node_modules/.bin/db-migrate up
test-e2e:
	@BABEL_ENV=server NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel-register --timeout 20000 --recursive test
test-unit:
	@NODE_ENV=test BABEL_ENV=client ./node_modules/.bin/jest
test:
	make test-setup
	make test-e2e
	make test-unit

migrate:
	@BABEL_ENV=server NODE_ENV=development ./node_modules/.bin/db-migrate $(RUN_ARGS)