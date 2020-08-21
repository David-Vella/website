from flask import Flask
import json, socket

CONFIG_FILE = 'website-keys/config.json'
LEADERBOARD_FILE = "website-keys/leaderboard.json"

if socket.gethostname() == 'flask-server':
    CONFIG_FILE = '/home/davella/website-keys/config.json'
    LEADERBOARD_FILE = '/home/davella/website-keys/leaderboard.json'

with open(CONFIG_FILE) as f:
    config = json.load(f)

app = Flask(__name__)
app.config['SECRET_KEY'] = config.get('SECRET_KEY')

from app import routes
