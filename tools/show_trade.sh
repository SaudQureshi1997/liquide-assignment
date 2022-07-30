#!/bin/bash

token=$2
curl -XGET -H "Content-Type: application/json" -H "Authorization: $token" http://localhost:3000/trades/$1