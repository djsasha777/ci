# NASOS CI/CD:
At first create github secrets for project

    GITHUB_TOKEN == token from github api
    LAST_IMAGE_TAG == any string or number
    EMAIL_SENDER_USERNAME == admins email gmail
    EMAIL_SENDER_PASSWORD == admins email pass gmail
    MONGODB_DB == database name
    MONGODB_LOGIN == mongodb login
    MONGODB_PASSWORD == mongodb password
    SSH_PRIVATE_KEY == private key of remote host
    INVENTORY == ansible inventotu file == "myhost ansible_ssh_host=192.168.1.121 ansible_ssh_user=root"
    SSH_HOST == ip address of host
    SSH_HOST_USER == username of host

commands for testing api

curl -X PUT -H "Content-Type: application/json" -d '{"device": 222, "upsensor": true, "downsensor": true, "flowsensor": 4, "relay": true, "workmode": 8, "errors": "no err"}' http://3.84.62.193:8444/setsensor/222

curl -X POST -H "Content-Type: application/json" -d '{"device": 222, "upsensor": false, "downsensor": false, "flowsensor": 4, "relay": true, "workmode": 1, "errors": "no err"}' http://3.84.62.193:8444/addsensor/

need https