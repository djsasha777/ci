FROM python:3.10.0b3-alpine3.14
ENV REPO \
    BRANCH \
    FILEPATH \
    TOKEN \
    EXTERNAL
WORKDIR /app
ADD watcher/main.py /app
ADD watcher/requirements.txt /app/
EXPOSE 8088
RUN pip install --no-cache-dir -r requirements.txt
CMD ["python", "/app/main.py"]