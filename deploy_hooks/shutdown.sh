#!/bin/bash

DIRECTORY=/var/www/cart/node_modules

if [ -d "$DIRECTORY" ]; then
	
	if [ $(ps aux | grep $USER | grep forever | grep -v grep | wc -l | tr -s "\n") -eq 1 ]
	then
		echo 'Stopping forever: /var/www/cart/node_modules/forever/bin/forever stop 0'
		cd /var/www/cart && node_modules/forever/bin/forever stopall
		kill $(ps aux | grep 'thumbd' | awk '{print $2}')
	fi

fi

exit 0;