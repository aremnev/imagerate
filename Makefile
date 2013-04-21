REPORTER=dot
TESTS=$(shell find ./tests -type f -name "*.js")

PROJECT = "Imagerate Node.js project"

all: install test start

test: ;@echo "Testing ${PROJECT}....."; \
    NODE_ENV=test ./node_modules/.bin/mocha \
        --require should \
        --reporter $(REPORTER) \
        $(TESTS)

test-cov: app-cov
	@COVERAGE=1 $(MAKE) --quiet test REPORTER=html-cov > coverage.html

app-cov:
	./node_modules/.bin/jscoverage  app app-cov

install: ;@echo "Installing ${PROJECT}....."; \
	git pull && npm install

clean : ;@echo "Clean ${PROJECT}.....";
	rm -rf node_modules

start : ;@echo "Starting ${PROJECT}....."; \
	node app.js


.PHONY: test start install clean test-cov