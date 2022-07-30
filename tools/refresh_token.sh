#!/bin/bash

token=$1
curl -XPOST -H "Content-Type: application/json" -H "Refresh: $token" http://localhost:3000/auth/refresh