package http

import future.keywords.if

default allow = false

# Extract HTTP request information
request_path = input.attributes.request.http.path
request_headers = input.attributes.request.http.headers

# Todo: Expected Dapr API token (this should be retrieved from Kubernetes secret)
expected_dapr_token := "test_1234"  # This value should be dynamically injected

# Check if the path contains "/system/"
is_system_route if {
    regex.match(".*/system/.*", request_path)
}

# Ensure `dapr-app-id` header is present
valid_dapr_header if {
    request_headers["dapr-app-id"]
}

# Ensure `dapr-api-token` is present and matches expected value
valid_dapr_token if {
    request_headers["dapr-api-token"] == expected_dapr_token
}

# If the route does not contain "/system/", allow access
allow if {
    not is_system_route  # Allow if it's not a "/system/" route
}

# Allow only if it's a /system/ request and the dapr header and token are valid
allow if {
    is_system_route
    valid_dapr_header
    valid_dapr_token
}