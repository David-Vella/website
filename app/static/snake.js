// Snake by davella 1/5/2020
// adapted from Code Explained: https://youtu.be/9TcU2C1AACw

const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const rst = document.getElementById("reset-button");
const submit = document.getElementById("add-button");
const low_score = document.getElementById("low_score").innerHTML;
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

genFood();

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

// determine new direction of the snake when a key is pressed
let firstPress = false;
document.addEventListener("keydown", direction);
function direction(event) {
    if (firstPress == false) {
        firstPress = true;
        count = 0;
    }
    let input = inputs[0];
    if ((event.keyCode == 37 || event.keyCode == 65 || event.keyCode == 74) && inputs[0] != "RIGHT") {
        input = "LEFT";
    } else if ((event.keyCode == 38 || event.keyCode == 87 || event.keyCode == 73) && inputs[0] != "DOWN") {
        input = "UP";
    } else if ((event.keyCode == 39 || event.keyCode == 68 || event.keyCode == 76) && inputs[0] != "LEFT") {
        input = "RIGHT";
    } else if ((event.keyCode == 40 || event.keyCode == 83 || event.keyCode == 75) && inputs[0] != "UP") {
        input = "DOWN";
    }
    if (input != inputs[0]) inputs.push(input);
}

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
    $.getJSON($SCRIPT_ROOT + '/update_scores', {
        current_score: score,
        name: disp_name
    }, function(data) {
        if (data.high_score) {
            document.getElementById("add-button").style.display = 'none';     
            document.getElementById("enter-display-name").style.display = 'none';
            rst.style.display = 'flex';  
            document.getElementById("add-confirm").style.display = 'block';
            document.getElementById("rank").innerHTML = String(data.rank);
        }
    });
}

let game = setInterval(print, 40);
