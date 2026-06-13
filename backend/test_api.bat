@echo off
SET API_URL="http://localhost:80"

curl -X GET "%API_URL%/health"
echo.

curl -X POST "%API_URL%/users/" -H "Content-Type: application/json" -d "{\"name\": \"hacker\", \"password\": \"pwned\"}"
echo.

curl -X GET "%API_URL%/users/usernameConstraint?name=hacker"
echo.

curl -X GET "%API_URL%/users/1"
echo.

curl -v -X POST "%API_URL%/users/login" -H "Content-Type: application/json" -d "{\"name\": \"admin\", \"password\": \"admin_password\"}"
echo.

curl -X POST "%API_URL%/items/" -H "Content-Type: application/json" -d "{\"name\": \"Skradzione dane\", \"user_id\": 4}"
echo.

curl -X GET "%API_URL%/items/1"
echo.

curl -X POST "%API_URL%/permissions/" -H "Content-Type: application/json" -d "{\"permission\": 1, \"user_id\": 4}"
echo.

curl -X GET "%API_URL%/permissions/1"
echo.