FROM python:3.10.0b3-alpine3.14
ENV MONGODB_USERNAME \
    MONGODB_PASSWORD \
    MONGODB_SERVER \
    MONGODB_DATABASE
WORKDIR /nasos
ADD nasos/main.py /nasos
ADD nasos/requirements.txt /nasos
EXPOSE 8444
RUN pip install --no-cache-dir -r requirements.txt
CMD ["python", "/nasos/main.py"]