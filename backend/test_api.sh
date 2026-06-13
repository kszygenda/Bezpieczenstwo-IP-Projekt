#!/bin/bash

API_URL="http://localhost:80"

curl -X GET "$API_URL/health" | jq

curl -X POST "$API_URL/users/" \
     -H "Content-Type: application/json" \
     -d '{"name": "hacker", "password": "pwned"}' | jq

curl -X GET "$API_URL/users/usernameConstraint?name=hacker" | jq

curl -X GET "$API_URL/users/1" | jq

curl -v -X POST "$API_URL/users/login" \
     -H "Content-Type: application/json" \
     -d '{"name": "admin", "password": "admin_password"}'

curl -X POST "$API_URL/items/" \
     -H "Content-Type: application/json" \
     -d '{"name": "Skradzione dane", "user_id": 4}' | jq

curl -X GET "$API_URL/items/1" | jq

curl -X POST "$API_URL/permissions/" \
     -H "Content-Type: application/json" \
     -d '{"permission": 1, "user_id": 4}' | jq

curl -X GET "$API_URL/permissions/1" | jq