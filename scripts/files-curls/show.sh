#!/bin/sh

API="http://localhost:4741"
URL_PATH="/files"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"
--data '{
    "file": {
      "title": "'"${TITLE}"'",
      "tags":"'"${TAGS}"'",
      "type":"'"${TYPE}"'"
    }
  }'

echo
