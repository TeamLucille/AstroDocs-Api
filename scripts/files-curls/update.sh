#!/bin/bash

API="http://localhost:4741"
URL_PATH="/files"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
    "file": {
      "title": "'"${TITLE}"'",
      "tags":"'"${TAGS}"'",
      "text": "'"${TEXT}"'",
      "type":"'"${TYPE}"'"
    }
  }'

echo