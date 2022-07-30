#!/bin/bash

token=$1
curl -XGET -H "Content-Type: application/json" -H "Authorization: $token" http://localhost:3000/trades?type=BUY