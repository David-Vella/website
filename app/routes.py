from flask import render_template, url_for, redirect, request, jsonify
from app import app, leaderboard

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')

@app.route("/resume")
def resume():
    return redirect(url_for('static', filename='resume.pdf'))

@app.route("/snake")
def snake():
    games = leaderboard.games()
    low_score = leaderboard.lowest()
    board = leaderboard.dump_list(10)
    return render_template('play.html', leaderboard=board, count=games, low_score=low_score, api_url=url_for('update_leaderboard'))

@app.route("/api/v1/update_leaderboard", methods=["POST"])
def update_leaderboard():
    high_score = False
    request.json.get
    score = request.json.get('current_score', 0)
    name = request.json.get('name', "user").strip()

    if name == "":
        name = "user"

    high_score, rank = leaderboard.update(name, score)

    if high_score:
        return jsonify(high_score=high_score, rank=rank, score=score)
    else:
        return redirect(url_for('snake'))

@app.route("/snake-leaderboard")
def snake_leaderboard():
    board = leaderboard.dump_list()
    return render_template('leaderboard.html', leaderboard=board)

@app.route("/snake-about")
def snake_about():
    return render_template('about.html')
