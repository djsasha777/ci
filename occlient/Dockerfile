FROM ubuntu:22.04
COPY occlient/entrypoint.sh /
entrypoint chmod u+x entrypoint.sh
# RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
#     sed -i 's/AllowTcpForwarding no/AllowTcpForwarding yes/' /etc/ssh/sshd_config && \
#     sed -i 's/#AllowAgentForwarding yes/AllowAgentForwarding yes/' /etc/ssh/sshd_config && \
#     sed -i 's/GatewayPorts no/GatewayPorts yes/' /etc/ssh/sshd_config
RUN apt update && apt install libssl-dev openconnect
CMD ["./entrypoint.sh"]
