from flask import Flask
import json, socket

PATH = ''

if socket.gethostname() == 'flask-server':
    PATH = '/home/davella/'

with open(PATH + 'website-keys/config.json') as f:
    config = json.load(f)

app = Flask(__name__)
app.config['SECRET_KEY'] = config.get('SECRET_KEY')

from app import routes
