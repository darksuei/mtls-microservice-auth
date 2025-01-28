package daprauth

import future.keywords.if

default allow = false

dapr_api_token = input["dapr-api-token"]

# Note: Update the token value
allow = true if {
    dapr_api_token == "test_1234"
}
