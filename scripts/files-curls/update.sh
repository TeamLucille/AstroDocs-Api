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
      "text": "'"${TEXT}"'",
      "tags":"'"${TAGS}"'",
      "type":"'"${TYPE}"'"
    }
  }'

echo