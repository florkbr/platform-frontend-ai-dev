#!/usr/bin/env bash
# Launch Chrome with remote debugging for chrome-devtools MCP.
# Uses a separate profile so it doesn't interfere with your normal Chrome/Chromium.
exec google-chrome \
  --remote-debugging-port=9222 \
  --ignore-certificate-errors \
  --host-rules="MAP consent.trustarc.com 127.0.0.1" \
  --user-data-dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.chrome-profile" \
  --no-first-run \
  --no-default-browser-check \
  --disable-default-apps \
  --disable-sync \
  --disable-extensions \
  --disable-popup-blocking
