#!/bin/bash
if [ "$(docker ps -q -f name=guitar-shop-front)" ]; then docker-compose down && docker system prune; fi