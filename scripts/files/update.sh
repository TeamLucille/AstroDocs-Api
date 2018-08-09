API="http://localhost:4741"
URL_PATH="/files"

curl "${API}${URL_PATH}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
  #--header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "file": {
      "title": "'"${TITLE}"'",
      "tag":"'"${TAG}"'",
      "type":"'"${TYPE}"'"
    }
  }'

echo