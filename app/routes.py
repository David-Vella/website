from flask import render_template, url_for, redirect, request, jsonify
from app import app, leaderboard

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')

@app.route("/resume")
def resume():
    return redirect("https://raw.githubusercontent.com/David-Vella/resume/master/DavidVellaResume.pdf")

@app.route("/snake")
def snake():
    games = leaderboard.games()
    board = leaderboard.dump_list()
    return render_template('snake.html', leaderboard=board, games=games)

@app.route("/play")
def play():
    return render_template("play.html")

@app.route("/api/v1/check_score", methods=["POST"])
def check_score():
    high_score = False

    score = request.json.get("score", 0)

    if score > 0:
        leaderboard.incrament()

    if leaderboard.lowest() <= score:
        high_score = True
    
    return jsonify(high_score=high_score)

@app.route("/api/v1/update_leaderboard", methods=["POST"])
def update_leaderboard():
    high_score = False

    score = request.json.get('score', 0)
    name = request.json.get('name', "user").strip()

    if name == "":
        name = "user"

    high_score, rank = leaderboard.update(name, score)

    return jsonify(high_score=high_score, rank=rank)
