#!/bin/bash

API="http://localhost:4741"
URL_PATH="/files"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "file": {
      "title": "'"${TITLE}"'",
      "tags":"'"${TAGS}"'",
      "owner":"'"${OWNER}"'",
      "type":"'"${TYPE}"'"
    }
  }'

echo