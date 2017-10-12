// create direction instance
var Direction = new function () {
    this.UP = 38;
    this.RIGHT = 39;
    this.DOWN = 40;
    this.LEFT = 37;
};

// pannel init size
var Common = new function () {
    this.width = 20;
    this.height = 20;
    this.speed = 300;
    this.workThread = null;
};

// main 
var main = new function () {
    var contorl = new Contorl();
    window.onload = function () {
        contorl.Init ("pannel");
        // start button
        document.getElementById("reStart").style.display = "none";
        document.getElementById("startButton").onclick = function () {
            contorl.Start();
            this.disable = true;
            document.getElementById("selSize");
            this.style.display = "none";
            document.getElementById("reStart").style.display = "block";
        };
        document.getElementById("selSize").onchange = function () {
            Common.width = this.value;
            Common.height = this.value;
            contorl.Init("pannel");
        };
        document.getElementById("selSpeed").onchange = function () {
            Common.speed = this.value;
        }
    };
};

// create contorller
function Contorl () {
    this.snake = new Snake();
    this.food = new Food();
    // create table
    this.Init = function (pid) {
        var html = [];
        html.push("<table>");
        for (var y = 0; y < Common.height; y++) {
            html.push("<tr>");
            for (var x = 0; x < Common.width; x++) {
                html.push('<td id="box_' + x + "_" + y + '"> </td>');
            }
            html.push("</tr>");
        }
        html.push("</table>");
        this.pannel = document.getElementById(pid);
        this.pannel.innerHTML = html.join("");
    };
    // start game
    this.Start = function () {
        var me = this;
        this.MoveSnake = function (ev) {
            var evt = window.event || ev;
            me.snake.SetDir(evt.keyCode);
        };
        try {
            document.attachEvent("onkeydown", this.MoveSnake);
        }
        catch (e) {
            document.addEventListener("keydown", this.MoveSnake, false);
        }
        this.food.Create();
        Common.workThread = setInterval (function () {
            me.snake.Eat(me.food);
            me.snake.Move();
        }, Common.speed);
    };
}

// class Snake
function Snake () {
    this.score = 0;
    this.isDone = false;
    this.dir = Direction.RIGHT;
    this.pos = new Array(new Position());
    // move - clean tail, move forward, judge snake bite itself or hit wall
    this.Move = function () {
        document.getElementById("box_" + this.pos[0].X + "_" + this.pos[0].Y).className = "";
        // move snake's body
        for (var i = 0; i < this.pos.length - 1; i++) {
            this.pos[i].X = this.pos[i + 1].X;
            this.pos[i].Y = this.pos[i + 1].Y;
        }
        //reset snake's head
        var head = this.pos[this.pos.length - 1];
        switch (this.dir) {
            case Direction.UP: head.Y--; break;
            case Direction.RIGHT: head.X++; break;
            case Direction.DOWN: head.Y++; break;
            case Direction.LEFT: head.X--; break;
        }
        this.pos[this.pos.length - 1] = head;
        // draw snake
        for (var i = 0; i < this.pos.length; i++) {
            var isBiteItself = false;
            for (j = i + 1; j < this.pos.length; j++) {
                if (this.pos[j].X == this.pos[i].X && this.pos[j].Y == this.pos[i].Y) {
                    isBiteItself = true;
                    break;
                }
            }
            if (isBiteItself) {
                this.Over(); // bite itself
                break;
            }
            var obj = document.getElementById("box_" + this.pos[i].X + "_" + this.pos[i].Y);
            if (obj) {
                if (i == this.pos.length - 1) {
                    obj.className = "snakeHead";
                }
                else {
                    obj.className = "snake";
                }
            }
            else{
                this.Over(); // hit wall
                break;
            }
        }
        this.isDone = true;
    };
    // game over
    this.Over = function () {
        clearInterval(Common.workThread);
        alert("Game Over");
    };
    // eat food
    this.Eat = function (food) {
        var head = this.pos[this.pos.length - 1];
        var isEat = false;
        switch (this.dir) {
            case Direction.UP:
                if (head.X == food.pos.X && head.Y == food.pos.Y + 1) {
                    isEat = true;
                }
                break;
            case Direction.RIGHT:
                if (head.Y == food.pos.Y && head.X == food.pos.X - 1) {
                    isEat = true;
                }
                break;
            case Direction.DOWN:
                if (head.X == food.pos.X && head.Y == food.pos.Y - 1) {
                    isEat = true;
                }
                break;
            case Direction.LEFT:
                if (head.Y == food.pos.Y && head.X == food.pos.X + 1) {
                    isEat = true;
                }
                break;
        }
        if (isEat) {
            this.pos[this.pos.length] = new Position(food.pos.X, food.pos.Y);
            food.Create(this.pos);
            this.score += 5;
            document.getElementById("score").innerHTML = "Score: " + this.score;
        }
    };
    // contorl direction
    this.SetDir = function (dir) {
        switch (dir) {
            case Direction.UP:
                if (this.isDone && this.dir != Direction.DOWN) { 
                    this.dir = dir;
                    this.isDone = false; 
                }
                break;
            case Direction.RIGHT:
                if (this.isDone && this.dir != Direction.LEFT) {
                    this.dir = dir;
                    this.isDone = false;
                }
                break;
            case Direction.DOWN:
                if (this.isDone && this.dir != Direction.UP) {
                    this.dir = dir;
                    this.isDone = false;
                }
                break;
            case Direction.LEFT:
                if (this.isDone && this.dir != Direction.RIGHT) {
                    this.dir = dir;
                    this.isDone = false;
                }
                break;
        }
    };
}

function Food () {
    this.pos = new Position();
    this.Create = function (pos) {
        document.getElementById("box_" + this.pos.X + "_" + this.pos.Y).className = "";
        var x = 0, y = 0, isCover = false;
        do {
            x = parseInt(Math.random() * (Common.width - 1));
            y = parseInt(Math.random() * (Common.height - 1));
            isCover = false;
            if (pos instanceof Array) {
                for (var i = 0; i < pos.length; ++i) {
                    if (x == pos[i].X && y == pos[i].Y) {
                        isCover = true;
                        break;
                    }
                }
            }
        }while(isCover);
        this.pos = new Position(x, y);
        document.getElementById("box_" + x + "_" + y).className = "food";
    };
}

function Position (x, y) {
    this.X = 0;
    this.Y = 0;
    if (arguments.length >= 1) {
        this.X = x;
    }
    if (arguments.length >= 1) {
        this.Y = y;
    }
}