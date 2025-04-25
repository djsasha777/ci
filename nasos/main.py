from flask import Flask, jsonify, request
from flask_mongoengine import MongoEngine
from prometheus_flask_exporter import PrometheusMetrics

import os

app = Flask(__name__)
username = os.getenv('MONGODB_USERNAME')
password = os.getenv('MONGODB_PASSWORD')
server = os.getenv('MONGODB_SERVER')
database = os.getenv('MONGODB_DATABASE')
port = '27017'

app.config['MONGODB_SETTINGS'] = {
    'db': database,
    'host': "mongodb://{}:{}@{}:{}/{}?authSource=admin".format(username, password, server, port, database)
}

db = MongoEngine(app)

metrics = PrometheusMetrics(app)

class Sensor(db.Document):
    device = db.IntField()
    upsensor = db.IntField()
    downsensor = db.IntField()
    flowsensor = db.IntField()
    relay = db.IntField()
    workmode = db.IntField()
    errors = db.StringField()

#delete after testing**********************
@app.route('/dbtest')
def test_page():
    startpage = Sensor.objects()
    return  jsonify(startpage), 200

@app.route('/flasktest')
def hello_page():
    return 'Hello, page from flask!'
#delete upside after testing***************

@app.route('/getsensor/<id>')
def  get_sensors(id: str):
    sensors = Sensor.objects.first_or_404(device=id)
    return  jsonify(sensors), 200

@app.route('/setsensor/<id>', methods=['PUT'])
def update_sensors(id: str):
    body = request.get_json()
    sensors = Sensor.objects.get_or_404(device=id)
    sensors.update(**body)
    return True

@app.route('/addsensor/', methods=['POST'])
def add_sensors():
    body = request.get_json()
    sensor = Sensor()
    sensor.device = body.get("device")
    sensor.upsensor = body.get("upsensor")
    sensor.downsensor = body.get("downsensor")
    sensor.flowsensor = body.get("flowsensor")
    sensor.relay = body.get("relay")
    sensor.workmode = body.get("workmode")
    sensor.errors = body.get("errors")
    sensor.save()
    return jsonify(sensor), 201

if __name__ == "__main__":
    print("Ready to start app...")
    app.run(host='0.0.0.0', port=8444, debug=False)