#!/bin/bash

# Fetch the server certificate and extract the public key's SHA-256 fingerprint
PIN=$(openssl s_client -connect "$VPN_SERVER":443 -showcerts </dev/null 2>/dev/null | \
      openssl x509 -outform PEM | \
      openssl x509 -noout -pubkey | \
      openssl pkey -pubin -outform DER | \
      openssl dgst -sha256 -binary | \
      base64)

# Format the pin as required for VPN_SERVERCERT
VPN_SERVERCERT="pin-sha256:$PIN"

# Export or use the VPN_SERVERCERT as needed
export VPN_SERVERCERT

# Check if necessary environment variables are set
if [ -z "$VPN_SERVER" ] || [ -z "$VPN_USERNAME" ] || [ -z "$VPN_PASSWORD" ] || [ -z "$VPN_SERVERCERT" ]; then
    echo "VPN_SERVER, VPN_USERNAME, VPN_PASSWORD, and VPN_SERVERCERT environment variables must be set" >> "$OPENCONNECT_LOG" >&2 
    exit 1
fi

# Start OpenConnect and log output
echo "Starting OpenConnect..."
echo "$VPN_PASSWORD" | openconnect --user="$VPN_USERNAME" --passwd-on-stdin --servercert "$VPN_SERVERCERT" "$VPN_SERVER" >> "$OPENCONNECT_LOG" 2>&1 &
tail -f "$OPENCONNECT_LOG"