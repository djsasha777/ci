FROM alpine:3.17
COPY occlient/entrypoint.sh /
entrypoint chmod u+x entrypoint.sh
RUN apk update && apk add --no-cache \
  gnutls \
  openssh \
  openconnect \
  curl
CMD ["./entrypoint.sh"]
