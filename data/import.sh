#!/bin/bash

# init database
mongo imagerate ./data/init.js

# insert test data
mongoimport -d test-imagerate -c users --file ./data/users.json --jsonArray