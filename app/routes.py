from flask import render_template, url_for, flash, redirect, request, jsonify
from app import app, leaderboard

@app.route("/")
@app.route("/snake")
def snake():
    games = leaderboard.games()
    low_score = leaderboard.lowest()
    board = leaderboard.dump_list(10)
    return render_template('play.html', leaderboard=board, count=games, low_score=low_score)

@app.route("/update_scores")
def update_scores():
    high_score = False
    score = request.args.get('current_score', 0, type=int)
    name = request.args.get('name', "user", type=str).strip()

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
