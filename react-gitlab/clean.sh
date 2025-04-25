#!/bin/bash
if [ "$(docker ps -q -f name=myreaktapp)" ]; then docker stop myreaktapp && docker rm myreaktapp; fi
