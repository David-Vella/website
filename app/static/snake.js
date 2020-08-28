// Snake by davella 1/5/2020
// adapted from Code Explained: https://youtu.be/9TcU2C1AACw

let cvs = document.getElementById("canvas");
let cnt = document.getElementById("container");
let bar = document.getElementById("bottom-bar");

function resize() {
    cvs.width = 144;
    cvs.height = 144;

    if (window.innerWidth > window.innerHeight) {
        while (cvs.width + 48 < window.innerHeight) {
            cvs.width += 48;
            cvs.height += 48;
        }
        cnt.style.width = String(window.innerHeight * 0.9) + "px";
        bar.style.width = String(window.innerHeight * 0.9) + "px";
        bar.style.height = String(window.innerHeight * 0.09) + "px";
        cvs.style.width = String(window.innerHeight * 0.9) + "px";
        cvs.style.height = String(window.innerHeight * 0.9) + "px";
    } else {
        while (cvs.width + 48 < window.innerWidth) {
            cvs.width += 48;
            cvs.height += 48;
        }
        cvs.style.height = String(window.innerWidth) + "px";
    }
}
resize();
window.onresize = resize;

function show_mobile_controls() {
    document.getElementById("show-mobile").style.display = "none";
    document.getElementById("hide-mobile").style.display = "block";

    const link = document.createElement("link");

    link.id = "mobile-controls";
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = document.getElementById("mobile-controls-url").innerHTML;

    document.head.appendChild(link);

    resize();
}

function hide_mobile_controls() {
    document.getElementById("hide-mobile").style.display = "none";
    document.getElementById("show-mobile").style.display = "block";

    document.getElementById("mobile-controls").remove();

    resize();
}

function show_game_over() {
    document.getElementById("game-over").style.display = "flex";
    document.getElementById("send-score").style.display = "none";
    document.getElementById("show-rank").style.display = "none";
}

function show_send_score() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("send-score").style.display = "flex";
    document.getElementById("show-rank").style.display = "none";
}

function show_rank() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("send-score").style.display = "none";
    document.getElementById("show-rank").style.display = "flex";
}

function hide_all() {
    document.getElementById("game-over").style.display = "none";
    document.getElementById("send-score").style.display = "none";
    document.getElementById("show-rank").style.display = "none";
}

if (window.innerWidth <= 600) {
    show_mobile_controls();
}

let score = 0;
let count = 0;
let first_press = false;
let inputs = [];

function check_first_press() {
    if (first_press == false) {
        first_press = true;
        count = 0;
    }
}

function input_left() {
    check_first_press();
    let last = inputs.slice(-1)[0]
    if (last != "LEFT" && last != "RIGHT") {
        inputs.push("LEFT");
    }
}

function input_right() {
    check_first_press();
    let last = inputs.slice(-1)[0];
    if (last != "RIGHT" && last != "LEFT") {
        inputs.push("RIGHT");
    }
}

function input_up() {
    check_first_press();
    let last = inputs.slice(-1)[0];
    if (last != "UP" && last != "DOWN") {
        inputs.push("UP");
    }
}

function input_down() {
    check_first_press();
    let last = inputs.slice(-1)[0];
    if (last != "DOWN" && last != "UP") {
        inputs.push("DOWN");
    }
}

function run_script() {
    hide_all();

    const ctx = cvs.getContext("2d");

    const board = 16;
    const unit = cvs.width / board;
    const subgrid = 3;

    let grow = 0;
    let food;

    score = 0;
    count = 0;
    first_press = false;
    inputs = [];

    // snake is an array of point objects which contain an x and y property
    let snake = [];
    snake[0] = {
        x : (board / 2) * unit,
        y : (board / 2) * unit
    }

    // generates a food square randomly on the board
    function genFood() {
        openSpaces = [];
        for (let xpos = 0; xpos < board; xpos++) {
            for (let ypos = 0; ypos < board; ypos++) {
                point = {
                    x : xpos * unit,
                    y : ypos * unit
                }
                if (collision(point) == false) {
                    openSpaces.push(point);
                }
            }
        }
        food = openSpaces[Math.floor(Math.random() * openSpaces.length)];
    }
    genFood();

    function direction(event) {
        if (event.keyCode == 37 || event.keyCode == 65) {
            input_left();
        } else if (event.keyCode == 38 || event.keyCode == 87) {
            input_up();
        } else if (event.keyCode == 39 || event.keyCode == 68) {
            input_right();
        } else if (event.keyCode == 40 || event.keyCode == 83) {
            input_down();
        }
    }
    document.addEventListener("keydown", direction);

    // checks if point object coinsides with snake
    // the piont object contains an x and y porperty
    function collision(point) {
        for (let i = 0; i < snake.length; i++) {
            if (point.x == snake[i].x && point.y == snake[i].y) {
                return true;
            }
        }
        return false;
    }

    // updates snakes position every call
    // updates snake direction every third call
    function print() {
        
        // print the sore
        document.getElementById("score").innerHTML = String(score);

        // start with blank canvas with grid
        for (let x = 0; x < board; x++) {
            for (let y = 0; y < board; y++) {
                ctx.fillStyle = "black";
                ctx.fillRect(x * unit, y * unit, unit, unit);
                ctx.strokeStyle = "grey";
                ctx.strokeRect(x * unit, y * unit, unit, unit);
            }
        }

        // print the snake
        for (let i = 0; i < snake.length; i++) {
            if (i < subgrid) {
                ctx.fillStyle = "lightgreen";
                ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
            } else {
                ctx.fillStyle = "green";
                ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
                ctx.strokeStyle = "lightgreen";
                ctx.strokeRect(snake[i].x, snake[i].y, unit, unit)
            }
        }
        
        // print the food
        ctx.fillStyle = "red";
        ctx.fillRect(food.x, food.y, unit, unit);

        // old head position
        let headX = snake[0].x;
        let headY = snake[0].y;

        // only change the snakes direction if it is aligned with the grid
        if (count == 0 && inputs.length > 1) inputs.shift();
        if (inputs[0] == "LEFT") headX -= unit / subgrid;
        if (inputs[0] == "UP") headY -= unit / subgrid;
        if (inputs[0] == "RIGHT") headX += unit / subgrid;
        if (inputs[0] == "DOWN") headY += unit / subgrid;

        // if snake eats food, increase variable grow
        if (headX == food.x && headY == food.y) {
            score++;
            genFood();
            grow += subgrid;
        } 

        // if grow is greater than one, do not remove the last element in snake
        if (grow > 0) --grow;
        else snake.pop();

        let newHead = {
            x : headX,
            y : headY
        }

        // game over rules
        if (headX < 0 || headY < 0 || headX > (board - 1) * unit || headY > (board - 1) * unit
            || collision(newHead) == true) {

            clearInterval(game);
            check_score();
        }

        // add the new head to front of snake
        snake.unshift(newHead);

        // reset the counter
        if (count == subgrid - 1) count = 0;
        else count++;   
    }
    let game = setInterval(print, 40);
}
window.onload = run_script;

function check_score() {
    api_url = document.getElementById("check-score-url").innerHTML;

    const request = new XMLHttpRequest();

    request.open("POST", api_url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({
        score: score
    }));

    request.onload = function() {
        try {
            let data = JSON.parse(this.responseText);
            if (data.high_score) {
                show_send_score();
            } else {
                show_game_over();
            }
        } catch(SyntaxError) {
            show_game_over();
        }
    }
}

function send_score() {
    display_name = document.getElementById("display-name").value;
    api_url = document.getElementById("leaderboard-url").innerHTML;

    const request = new XMLHttpRequest();

    request.open("POST", api_url, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify({
        name: display_name,
        score: score
    }));

    request.onload = function() {
        try {
            var data = JSON.parse(this.responseText);
        } catch(SyntaxError) {
            show_game_over();
        }
        if (data.high_score) {
            document.getElementById("rank").innerHTML = String(data.rank);
            show_rank();
        } else {
            show_game_over();
        }
    }
}
