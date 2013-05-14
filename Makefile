REPORTER=spec
TESTS=$(shell find ./tests -type f -name "test*.js")
SHELL=/bin/bash

PROJECT = "project"
NAMESPACE = "contest-app"

all: install test start

test: ;@echo ""; \
	NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
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
	nodeenv env/node --node=0.10.5 --npm=1.2.18;
	@echo "*** Nodeenv with node-0.10.5 is created. Activate it: 'source env/node/bin/activate'."
	@echo "*** After that you can execute 'install', 'test' and 'start' commands."
	@echo "*** Also you can execute 'make all' command which is equal to 'make install test start'."


install: ;@echo "Installing ${PROJECT}....."; \
	sudo apt-get install mongodb && npm install;

clean: ;@echo "Clean ${PROJECT}....."; \
	rm -rf node_modules \
	rm -rf env \
	rm -f npm-shrinkwrap.json \
	rm -f coverage.html \
	rm -rf app-cov;

start: ;@echo "Starting ${PROJECT}....."; \
	npm start;

af-install: ;@echo "AppFog gem install....."; \
	sudo apt-get -y install ruby && sudo gem update && sudo gem install af

af-update: ;@echo "AppFog update ${PROJECT}....."; \
	npm shrinkwrap && \
	if [[ `af user | grep -F "[N/A]"` > /dev/null ]]; then af login; fi && \
	af update $(NAMESPACE)


.PHONY: test start install clean test-coverage af-update af-install all node-virtual
