FROM alpine:3.16.8
COPY occlient/entrypoint.sh /
RUN chmod u+x /entrypoint.sh
# RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
#     sed -i 's/AllowTcpForwarding no/AllowTcpForwarding yes/' /etc/ssh/sshd_config && \
#     sed -i 's/#AllowAgentForwarding yes/AllowAgentForwarding yes/' /etc/ssh/sshd_config && \
#     sed -i 's/GatewayPorts no/GatewayPorts yes/' /etc/ssh/sshd_config
RUN apk update && \
    apk add --no-cache openssh openssl openconnect
CMD ["/entrypoint.sh"]
