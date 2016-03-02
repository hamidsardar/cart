#!/bin/bash

n 0.12.2
cd /var/www/cart && node_modules/forever/bin/forever start -a -l /var/www/forever.log -o /var/www/out.log -e /var/www/err.log server.js;
exit 0;