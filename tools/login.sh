#!/bin/bash

curl -XPOST -H "Content-Type: application/json" http://localhost:3000/auth/login -d '{"name": "Saud", "password": "12345678"}'