REPORTER=dot
TESTS=$(shell find ./tests -type f -name "*.js")

PROJECT = "Imagerate Node.js project"
AF_NAMESPACE = "imagerate"

all: install test start

test: ;@echo "Testing ${PROJECT}....."; \
    NODE_ENV=test ./node_modules/.bin/mocha \
        --require should \
        --reporter $(REPORTER) \
        --timeout 10000 \
        $(TESTS)

test-cov: app-cov
	@COVERAGE=1 $(MAKE) --quiet test REPORTER=html-cov > coverage.html

app-cov:
	./node_modules/.bin/jscoverage  app app-cov

install: ;@echo "Installing ${PROJECT}....."; \
	git pull && npm install

clean : ;@echo "Clean ${PROJECT}.....";
	rm -rf node_modules && rm -f npm-shrinkwrap.json

start : ;@echo "Starting ${PROJECT}....."; \
	node app.js

afupdate : ;@echo "AppFog update ${PROJECT}....."; \
	npm shrinkwrap && af update $(AF_NAMESPACE)


.PHONY: test start install clean test-cov afupdate