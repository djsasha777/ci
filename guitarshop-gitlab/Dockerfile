FROM nginx:1.23.1-alpine
COPY build/ /var/www/html/
RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
