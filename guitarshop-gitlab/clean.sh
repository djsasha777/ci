#!/bin/bash
if [ "$(docker ps -q -f name=it-guitarshop-test)" ]; then docker stop it-guitarshop-test && docker rm it-guitarshop-test; fi
