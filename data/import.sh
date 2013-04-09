#!/bin/bash

# init database
mongo imagerate init.js

# insert test data
mongoimport -d imagerate -c users --file users.json --jsonArray
mongoimport -d imagerate -c contests --file contests.json --jsonArray
mongoimport -d imagerate -c images --file images.json --jsonArray