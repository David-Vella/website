from flask import Flask
import json

with open('/etc/website/config.json') as config_file:
    config = json.load(config_file)

app = Flask(__name__)
app.config['SECRET_KEY'] = config.get('SECRET_KEY')

from app import routes
