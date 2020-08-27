// Snake by davella 1/5/2020
// adapted from Code Explained: https://youtu.be/9TcU2C1AACw

let cvs = document.getElementById("canvas");
let cnt = document.getElementById("container");
let bar = document.getElementById("bottom-bar");

cvs.width = 144;
cvs.height = 144;

function resize() {
    let cvs_size = cvs.getBoundingClientRect();
    console.log(cvs_size.width);
    console.log(cvs_size.height);
    if (window.innerWidth > window.innerHeight) {
        console.log("true");
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
        console.log("false");
        while (cvs.width + 48 < window.innerWidth) {
            cvs.width += 48;
            cvs.height += 48;
        }
        cvs.style.height = String(window.innerWidth) + "px";
    }
    cvs_size = cvs.getBoundingClientRect();
    console.log("after:");
    console.log(cvs.width);
    console.log(cvs.height);
}
resize();
window.onresize = resize;

const ctx = cvs.getContext("2d");

const rst = document.getElementById("reset-button");
const submit = document.getElementById("add-button");
const low_score = document.getElementById("low-score").innerHTML;
disp_name = "user";

const board = 16;
const unit = cvs.width / board;
const subgrid = 3;

let score = 0;

let inputs = [];
let grow = 0;
let count;

let food;

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

let first_press = false;

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

function direction(event) {
    let input = inputs[0];
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
        }
        else {
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

        if (low_score <= score) {
            document.getElementById("flash_msg").style.display = 'block';
            document.getElementById("add-button").style.display = 'flex';     
            document.getElementById("enter-display-name").style.display = 'flex';                 
            submit.style.display = 'flex'; 
        } else {
            rst.style.display = 'flex'; 
            send_score();
        }
    }

    // add the new head to front of snake
    snake.unshift(newHead);

    // reset the counter
    if (count == subgrid - 1) count = 0;
    else count++;   
}

function send_score() {
    disp_name = document.getElementById("display-name").value;
    api_url = document.getElementById("api-url").innerHTML;

    const request = new XMLHttpRequest();
    request.open("POST", api_url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({
        name: disp_name,
        current_score: score
    }));

    request.onload = function() {
        try {
            var data = JSON.parse(this.responseText);
        }
        catch(SyntaxError) {
            return;
        }
        if (data.high_score) {
            document.getElementById("add-button").style.display = 'none';     
            document.getElementById("enter-display-name").style.display = 'none';
            rst.style.display = 'flex';  
            document.getElementById("add-confirm").style.display = 'block';
            document.getElementById("rank").innerHTML = String(data.rank);
        }
    }
}

let game = setInterval(print, 40);
