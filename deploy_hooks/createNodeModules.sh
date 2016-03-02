#!/bin/bash

DIRECTORY=/var/www/cart/node_modules

echo 'Removing node_modules directory'
rm -r $DIRECTORY

echo 'running mkdir'
mkdir $DIRECTORY

echo "chowning to justin"
chown justin $DIRECTORY

mkdir /var/www/cart/dist
chown justin /var/www/cart/dist

echo "" > /var/www/npm_install.txt
chown justin /var/www/npm_install.txt

echo "" > /var/www/out.log
chown justin /var/www/out.log

echo "" > /var/www/forever.log
chown justin /var/www/forever.log

echo "" > /var/www/err.log
chown justin /var/www/err.log

echo "" > /var/www/cart/newrelic_agent.log
chown justin /var/www/cart/newrelic_agent.log