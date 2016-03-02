#!/bin/bash

echo 'Running npm prune: npm prune'
cd /var/www/cart && npm prune 2> /var/www/npm_install.txt

echo 'Running npm install: npm install --production'
cd /var/www/cart && npm install --production 2> /var/www/npm_install.txt

echo 'Copying build artifacts'
if [ $NODE_ENV == "production" ]
then
	aws s3 cp s3://chargeback-builds /var/www/cart/dist --recursive
else
	aws s3 cp s3://chargeback-builds-dev /var/www/cart/dist --recursive
fi

exit 0;