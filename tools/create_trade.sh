#!/bin/bash

token=$1
curl -XPOST -H "Content-Type: application/json" -H "Authorization: $token" http://localhost:3000/trades -d '{"type": "BUY", "symbol": "BMX", "shares": 100, "price": 3450, "datetime": "2022-06-20T12:10:23.021Z"}'