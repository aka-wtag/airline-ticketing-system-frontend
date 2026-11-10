#!/bin/sh
# Replaces the default apiUrl with the value passed via container env API_URL
cat <<EOF > /app/public/assets/env.js
(function(window) {
  window.__env = window.__env || {};
  window.__env.apiUrl = "${API_URL:-http://localhost:8080}";
})(this);
EOF

exec "$@"
