#!/bin/bash
# Start frontend without workspace warnings
cd "$(dirname "$0")"
NODE_NO_WARNINGS=1 npx --no-install next dev --port 3000