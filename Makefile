REPORTER=spec
TESTS=$(shell find ./tests -type f -name "test*.js")
ACTIVATE_ENV=if [ -f env/node/bin/activate ]; then source env/node/bin/activate; fi
SHELL=/bin/bash

PROJECT = "project"

all: clean node-virtual install;
	@echo "*** Nodeenv with node-0.10.15 and installed modules is created.";
	@echo "*** Now you can execute 'test' and 'start' commands."

test: ;@echo ""; \
    $(ACTIVATE_ENV) && \
	NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout 20000 \
		$(TESTS)

test-coverage: app-cov
	@COVERAGE=1 $(MAKE) --silent --quiet test REPORTER=html-cov > coverage.html

app-cov:
	./node_modules/.bin/jscoverage app app-cov

node-virtual: ;@echo "Prepare nodeenv....."; \
	sudo apt-get install -y python-setuptools python-virtualenv curl && \
	virtualenv env && \
	source env/bin/activate && \
	easy_install nodeenv && \
	nodeenv env/node --node=0.10.25 --npm=1.3.24;
	@echo "*** Nodeenv with node-0.10.15 is created."
	@echo "*** Now you can execute 'install', 'test' and 'start' commands."


install: ;@echo "Installing ${PROJECT}....."; \
	$(ACTIVATE_ENV) && \
	sudo apt-get install -y mongodb && \
	rm -f npm-shrinkwrap.json && \
	npm install;

clean: ;@echo "Clean ${PROJECT}....."; \
	rm -rf node_modules \
	rm -rf env \
	rm -f npm-shrinkwrap.json \
	rm -f coverage.html \
	rm -rf app-cov;

start: ;@echo "Starting ${PROJECT}....."; \
    $(ACTIVATE_ENV) && \
	npm start;
	
heroku-install: ;@echo "Heroku install....."; \
	wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh

heroku-update: ;@echo "Heroku update....."; \
    ./scripts/heroku.sh

af-install: ;@echo "AppFog gem install....."; \
	sudo apt-get -y install ruby && \
	sudo gem update && \
	sudo gem install af

af-update: ;@echo "AppFog update ${PROJECT}....."; \
    $(ACTIVATE_ENV) && \
	npm shrinkwrap && \
	./scripts/af.sh


.PHONY: test start install clean test-coverage af-update af-install all node-virtual heroku-install
