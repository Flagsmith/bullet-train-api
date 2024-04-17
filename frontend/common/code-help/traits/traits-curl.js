module.exports = (
  envId,
  { TRAIT_NAME, USER_ID },
  userId,
) => `# This will create a user in the dashboard if they don't already exist

curl -i -X POST 'https://edge.api.flagsmith.com/api/v1/identities/' \\
     -H 'x-environment-key: ${envId}' \\
     -H 'Content-Type: application/json; charset=utf-8' \\
     -d $'{
  "traits": [
    {
      "trait_key": "${TRAIT_NAME}",
      "trait_value": 42
    },
  ],
  "identifier": "${userId || USER_ID}"
}'
`
