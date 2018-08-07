#!/bin/bash

API="http://localhost:4741"
URL_PATH="/files"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request DELETE \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "file": {
      "title": "'"${TITLE}"'",
      "tag":"'"${TAG}"'",
      "type":"'"${TYPE}"'"
    }
  }'

echo