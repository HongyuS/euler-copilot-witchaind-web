#!/bin/bash

export $(cat .env | xargs)

domain_limit="
        if (\$http_Host !~ ${SERVER_NAME} $) {
            return 403;
        }
"

ssl_settings="
        ssl_session_tickets off;
        ssl_session_timeout 5m;
        ssl_session_cache shared:SSL:10m;

        ssl_certificate /config/server.crt;
        ssl_certificate_key /config/server.key;
        ssl_password_file /config/pass.txt;
        ssl_dhparam /config/dhparam.pem;
        ssl_ecdh_curve auto;
        ssl_protocols TLSv1.2;
        ssl_ciphers \"ECDHE-RSA-AES256-GCM-SHA384\";
        ssl_prefer_server_ciphers on;
        ssl_stapling on;
        ssl_stapling_verify on;
"

if [[ -v DOMAIN_LIMIT_ENABLE_FLAG ]]; then
    export DOMAIN_LIMIT=$domain_limit
else
    export DOMAIN_LIMIT=""
fi

bash -c "envsubst '\${ERROR_FILE} \${LOG_FILE} \${PID_FILE} \${DATA_CHAIN_BACEND_URL}' < nginx.conf.tmpl > /config/nginx.conf"

nginx -c /config/nginx.conf -g "daemon off;"