import json, socket

LEADERBOARD_SIZE = 25
LEADERBOARD_FILE = "website-keys/leaderboard.json"

if socket.gethostname() == 'flask-server':
    LEADERBOARD_FILE = '/home/davella/website-keys/leaderboard.json'

def get():
    with open(LEADERBOARD_FILE, "r") as f:
        return(json.load(f))

def save(leaderboard):
    with open(LEADERBOARD_FILE, "w") as f:
        f.write(json.dumps(leaderboard, indent=4, sort_keys=True))

def games():
    leaderboard = get()
    return(leaderboard["games"])

def lowest():
    leaderboard = get()
    return(leaderboard[str(LEADERBOARD_SIZE)]["score"])

def incrament():
    leaderboard = get()
    leaderboard["games"] += 1
    save(leaderboard)

def update(user_name, user_score):
    if user_score > 0:
        incrament()

    leaderboard = get()

    high_score = False
    user_rank = 0

    for i in range(LEADERBOARD_SIZE, 0, -1):
        if user_score >= leaderboard[str(i)]["score"]:
            if i != LEADERBOARD_SIZE:
                leaderboard[str(i+1)]["name"] = leaderboard[str(i)]["name"]
                leaderboard[str(i+1)]["score"] = leaderboard[str(i)]["score"]
            leaderboard[str(i)]["name"] = user_name
            leaderboard[str(i)]["score"] = user_score

            high_score = True
            user_rank = i

    save(leaderboard)

    return(high_score, user_rank)

def dump_list(cap=LEADERBOARD_SIZE):
    leaderboard = get()
    out = []

    class User:
        def __init__(self, rank, name, score):
            self.rank = rank
            self.name = name
            self.score = score
    
    for i in range(1, cap+1):
        name = leaderboard[str(i)]["name"]
        score = leaderboard[str(i)]["score"]

        out.append(User(i, name, score))

    return(out)
