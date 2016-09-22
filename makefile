.PHONY: test
# Arg extraction
ifeq (migrate,$(firstword $(MAKECMDGOALS)))
  RUN_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
  $(eval $(RUN_ARGS):;@:)
endif

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
test:
	make test-setup
	@BABEL_ENV=server NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel-register --timeout 20000 --recursive test
test-with-junit-reporter:
	make test-setup
	@BABEL_ENV=server NODE_ENV=test ./node_modules/.bin/mocha --compilers js:babel-register --timeout 20000 --recursive --reporter mocha-junit-reporter test

migrate:
	@BABEL_ENV=server NODE_ENV=development ./node_modules/.bin/db-migrate $(RUN_ARGS)