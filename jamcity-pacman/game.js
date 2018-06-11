let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite;
Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;

let app = new Application({
    width: 456,
    height: 534,
    antialiasing: true,
    transparent: false,
    resolution: 1
});

document.body.appendChild(app.view);

loader
    .add("images/spritesheet.json")
    .add("images/bean.png")
    .add("images/empty.png")
    .add("images/pill.png")
    .add("images/wall_h.png")
    .add("images/wall_hd.png")
    .add("images/wall_hu.png")
    .add("images/wall_l.png")
    .add("images/wall_ld.png")
    .add("images/wall_lu.png")
    .add("images/wall_r.png")
    .add("images/wall_rd.png")
    .add("images/wall_ru.png")
    .add("images/wall_v.png")
    .add("images/wall_vl.png")
    .add("images/wall_vr.png")
    .add("images/wall_u.png")
    .add("images/wall_d.png")
    .add("images/door.png")
    .load(setup);

var GRID_WIDTH = 24;
var GRID_HEIGHT = 24;

var boardSpriteIds = [
    ["wall_lu", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_hu", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_ru"],
    ["wall_v", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "wall_v", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "wall_v"],
    ["wall_v", "pill", "wall_l", "wall_r", "bean", "wall_l", "wall_h", "wall_r", "bean", "wall_d", "bean", "wall_l", "wall_h", "wall_r", "bean", "wall_l", "wall_r", "pill", "wall_v"],
    ["wall_v", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "wall_v"],
    ["wall_v", "bean", "wall_l", "wall_r", "bean", "wall_u", "bean", "wall_l", "wall_h", "wall_hu", "wall_h", "wall_r", "bean", "wall_u", "bean", "wall_l", "wall_r", "bean", "wall_v"],
    ["wall_v", "bean", "bean", "bean", "bean", "wall_v", "bean", "bean", "bean", "wall_v", "bean", "bean", "bean", "wall_v", "bean", "bean", "bean", "bean", "wall_v"],
    ["wall_ld", "wall_h", "wall_h", "wall_ru", "bean", "wall_vl", "wall_h", "wall_r", "empty", "wall_d", "empty", "wall_l", "wall_h", "wall_vr", "bean", "wall_lu", "wall_h", "wall_h", "wall_rd"],
    ["empty", "empty", "empty", "wall_v", "bean", "wall_v", "empty", "empty", "empty", "red", "empty", "empty", "empty", "wall_v", "bean", "wall_v", "empty", "empty", "empty"],
    ["wall_h", "wall_h", "wall_h", "wall_rd", "bean", "wall_d", "empty", "wall_lu", "wall_r", "door", "wall_l", "wall_ru", "empty", "wall_d", "bean", "wall_ld", "wall_h", "wall_h", "wall_h"],
    ["empty", "empty", "empty", "empty", "bean", "empty", "empty", "wall_v", "blue", "pink", "yellow", "wall_v", "empty", "empty", "bean", "empty", "empty", "empty", "empty"],
    ["wall_h", "wall_h", "wall_h", "wall_ru", "bean", "wall_u", "empty", "wall_ld", "wall_h", "wall_h", "wall_h", "wall_rd", "empty", "wall_u", "bean", "wall_lu", "wall_h", "wall_h", "wall_h"],
    ["empty", "empty", "empty", "wall_v", "bean", "wall_v", "empty", "empty", "empty", "empty", "empty", "empty", "empty", "wall_v", "bean", "wall_v", "empty", "empty", "empty"],
    ["wall_lu", "wall_h", "wall_h", "wall_rd", "bean", "wall_d", "empty", "wall_l", "wall_h", "wall_hu", "wall_h", "wall_r", "empty", "wall_d", "bean", "wall_ld", "wall_h", "wall_h", "wall_ru"],
    ["wall_v", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "wall_v", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "wall_v"],
    ["wall_v", "bean", "wall_l", "wall_ru", "bean", "wall_l", "wall_h", "wall_r", "bean", "wall_d", "bean", "wall_l", "wall_h", "wall_r", "bean", "wall_lu", "wall_r", "bean", "wall_v"],
    ["wall_v", "pill", "bean", "wall_v", "bean", "bean", "bean", "bean", "bean", "pacman", "bean", "bean", "bean", "bean", "bean", "wall_v", "bean", "pill", "wall_v"],
    ["wall_vl", "wall_r", "bean", "wall_d", "bean", "wall_u", "bean", "wall_l", "wall_h", "wall_hu", "wall_h", "wall_r", "bean", "wall_u", "bean", "wall_d", "bean", "wall_l", "wall_v"],
    ["wall_v", "bean", "bean", "bean", "bean", "wall_v", "bean", "bean", "bean", "wall_v", "bean", "bean", "bean", "wall_v", "bean", "bean", "bean", "bean", "wall_v"],
    ["wall_v", "bean", "wall_l", "wall_h", "wall_h", "wall_hd", "wall_h", "wall_r", "bean", "wall_d", "bean", "wall_l", "wall_h", "wall_hd", "wall_h", "wall_h", "wall_r", "bean", "wall_v"],
    ["wall_v", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "bean", "wall_v"],
    ["wall_ld", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_h", "wall_rd"]
]
var gridDirectionTypes = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, 1, 0, 0, 7, 0, 0, 0, 2, -1, 1, 0, 0, 0, 7, 0, 0, 2, -1],
    [-1, 0, -1, -1, 0, -1, -1, -1, 0, -1, 0, -1, -1, -1, 0, -1, -1, 0, -1],
    [-1, 5, 0, 0, 9, 0, 7, 0, 8, 0, 8, 0, 7, 0, 9, 0, 0, 6, -1],
    [-1, 0, -1, -1, 0, -1, 0, -1, -1, -1, -1, -1, 0, -1, 0, -1, -1, 0, -1],
    [-1, 3, 0, 0, 6, -1, 3, 0, 2, -1, 1, 0, 4, -1, 5, 0, 0, 4, -1],
    [-1, -1, -1, -1, 0, -1, -1, -1, 0, -1, 0, -1, -1, -1, 0, -1, -1, -1, -1],
    [0, 0, 0, -1, 0, -1, 1, 0, 8, 0, 8, 0, 2, -1, 0, -1, 0, 0, 0],
    [-1, -1, -1, -1, 0, -1, 0, -1, -1, 0, -1, -1, 0, -1, 0, -1, -1, -1, -1],
    [0, 0, 0, 0, 9, 0, 6, -1, 0, 0, 0, -1, 5, 0, 9, 0, 0, 0, 0],
    [-1, -1, -1, -1, 0, -1, 0, -1, -1, -1, -1, -1, 0, -1, 0, -1, -1, -1, -1],
    [0, 0, 0, -1, 0, -1, 5, 0, 0, 0, 0, 0, 6, -1, 0, -1, 0, 0, 0],
    [-1, -1, -1, -1, 0, -1, 0, -1, -1, -1, -1, -1, 0, -1, 0, -1, -1, -1, -1],
    [-1, 1, 0, 0, 9, 0, 8, 0, 2, -1, 1, 0, 8, 0, 9, 0, 0, 2, -1],
    [-1, 0, -1, -1, 0, -1, -1, -1, 0, -1, 0, -1, -1, -1, 0, -1, -1, 0, -1],
    [-1, 3, 2, -1, 5, 0, 7, 0, 8, 0, 8, 0, 7, 0, 6, -1, 1, 4, -1],
    [-1, -1, 0, -1, 0, -1, 0, -1, -1, -1, -1, -1, 0, -1, 0, -1, 0, -1, -1],
    [-1, 1, 8, 0, 4, -1, 3, 0, 2, -1, 1, 0, 4, -1, 3, 0, 8, 2, -1],
    [-1, 0, -1, -1, -1, -1, -1, -1, 0, -1, 0, -1, -1, -1, -1, -1, -1, 0, -1],
    [-1, 3, 0, 0, 0, 0, 0, 0, 8, 0, 8, 0, 0, 0, 0, 0, 0, 4, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
];

var WALL = -1;
var EMPTY = 0;
var UP = 1;
var DOWN = 2;
var LEFT = 3;
var RIGHT = 4;

var BEAN = 2;
var PILL = 3;
var PACMAN_WALL = 4;

var RED = 0;
var PINK = 1;
var BLUE = 2;
var YELLOW = 3;

var GHOST_CHASE = 0;
var GHOST_SCATTER = 1;
var GHOST_PANIC = 2;

var state;
var timestamp;

var currentGhostState;
var titleScreen;
var gameplayScreen;
var pacmanwinScreen;
var gameOverScreen;
var chaseState;
var scatterState;
var panicState;

var ghostStateStartTime;

var speed = 160;
var gameStart = false;
var beanCount = 0;
var chaseTime = 20;
var scatterTime = 7;
var panicTime = 15;
var ghostAccuracyRate = 0.5;

var grids = [];
var ghosts = [];
var pacman;

var startTime;

var lives = 3;
var livesText;
var score = 0;
var scoreText;

//---------------------------------------------------------------------------------------------------//
//Start game
//---------------------------------------------------------------------------------------------------//
function setup() {
    inputSetup();
    resetGame();
    state = play;
    app.ticker.add(delta => gameLoop(delta));


}
//---------------------------------------------------------------------------------------------------//
//Update game
//---------------------------------------------------------------------------------------------------//
function play(delta) {
    if (!gameStart) {
        return;
    }

    timestamp = Math.round(new Date() / 1000);

    move(pacman);

    if (timestamp - ghostStateStartTime > currentGhostState.duration) {
        if (currentGhostState.state == GHOST_CHASE) {
            currentGhostState = scatterState;
            ghostStateStartTime = Math.round(new Date() / 1000);

        } else if (currentGhostState.state == GHOST_SCATTER) {
            currentGhostState = chaseState;
            ghostStateStartTime = Math.round(new Date() / 1000);
        } else if (currentGhostState.state == GHOST_PANIC) {
            currentGhostState = chaseState;
            ghostStateStartTime = Math.round(new Date() / 1000);
        }
    }
    for (let i = 0; i < ghosts.length; i++) {
        if (timestamp - startTime > i * 2) {
            move(ghosts[i]);
        }

    }

    eatBean();
    eatPacman();
}
//---------------------------------------------------------------------------------------------------//
//Game state related functions
//---------------------------------------------------------------------------------------------------//
function resetGame() {
    if (titleScreen != undefined) {
        titleScreen.destroy();
    }
    if (gameplayScreen != undefined) {
        gameplayScreen.destroy();
    }
    if (gameOverScreen != undefined) {
        gameOverScreen.destroy();
    }

    speed = 160;
    gameStart = false;
    beanCount = 0;
    chaseTime = 20;
    scatterTime = 7;
    ghostAccuracyRate = 0.5;
    lives = 3;
    score = 0;

    startTime = undefined;

    grids = [];
    ghosts = [];
    pacman = undefined;
    currentGhostState = undefined;
    ghostStateStartTime = undefined;

    gameplayScreen = new Container();
    app.stage.addChild(gameplayScreen);

    initBoard();
    initHub();
    initPacman();
    initGhost();
    showTitleScreen();
}
//---------------------------------------------------------------------------------------------------//
function resetLevel() {
    pacman.sprite.destroy();
    pacman = undefined;
    for (var i = 0; i < ghosts.length; i++) {
        ghosts[i].sprite.destroy();
    }
    ghosts = [];
    initGhost();
    initPacman();
    initGameStart();

}
//---------------------------------------------------------------------------------------------------//
function initGameStart() {
    gameStart = true;
    startTime = Math.round(new Date() / 1000);
    ghostStateStartTime = Math.round(new Date() / 1000);
    updateAnimation(pacman.animation, "pacman_walk", 4, 0.2, true);
    hideTitleScreen();
}
//---------------------------------------------------------------------------------------------------//
function setGameEnd(time) {
    setTimeout(function() {
        resetGame();
    }, time * 1000);
}
//---------------------------------------------------------------------------------------------------//
function getPacmanWin() {
    return beanCount = 0;
}
//---------------------------------------------------------------------------------------------------//
function gameLoop(delta) {
    state(delta);
}
//---------------------------------------------------------------------------------------------------//
//Game screens
//---------------------------------------------------------------------------------------------------//
function hideTitleScreen() {
    titleScreen.destroy();
}
//---------------------------------------------------------------------------------------------------//
function initTitleScreen() {
    titleScreen = new Container();
    app.stage.addChild(titleScreen);
    let style = new TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: "yellow",
        stroke: '#ff3300',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
    });

    let styledMessage = new Text("Press S key to start", style);
    styledMessage.position.set(72, 250);
    titleScreen.addChild(styledMessage);
}
//---------------------------------------------------------------------------------------------------//
function showTitleScreen() {
    initTitleScreen();
}
//---------------------------------------------------------------------------------------------------//
function showWinMessage() {
    gameOverScreen = new Container();
    app.stage.addChild(gameOverScreen);
    let style = new TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: "white",
        stroke: '#yellow',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
    });

    let styledMessage = new Text("You got " + score + " points!", style);
    styledMessage.anchor.set(0.5);
    styledMessage.position.set(app.screen.width / 2, app.screen.height / 2);
    gameOverScreen.addChild(styledMessage);
    setGameEnd(4);
}
//---------------------------------------------------------------------------------------------------//
function showFailMessage() {
    gameOverScreen = new Container();
    app.stage.addChild(gameOverScreen);
    let style = new TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: "#ff3300",
        stroke: '#black',
        strokeThickness: 2,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
    });

    let styledMessage = new Text("Fail", style);
    styledMessage.anchor.set(0.5);
    styledMessage.position.set(app.screen.width / 2, app.screen.height / 2);
    gameOverScreen.addChild(styledMessage);
    setGameEnd(3);
}
//---------------------------------------------------------------------------------------------------//
//Set up gameplay objects
//---------------------------------------------------------------------------------------------------//
function initBoard() {
    grids = [];
    for (let i = 0; i < boardSpriteIds.length; i++) {
        let rowGrids = [];
        for (let j = 0; j < boardSpriteIds[i].length; j++) {

            let bg = new Sprite(resources["images/empty.png"].texture);
            bg.x = 0 + j * GRID_WIDTH;
            bg.y = 0 + i * GRID_HEIGHT;
            gameplayScreen.addChild(bg);

            let sprite = new Sprite(resources["images/" + getGridImageId(boardSpriteIds[i][j]) + ".png"].texture);
            sprite.x = 0 + j * GRID_WIDTH;
            sprite.y = 0 + i * GRID_HEIGHT;
            let coord = new Vector2(j, i);
            let directionOptions = getGridDirectionOptions(gridDirectionTypes[i][j]);
            let type = getGridType(boardSpriteIds[i][j]);
            let grid = new Grid(sprite, coord, directionOptions, type);
            rowGrids.push(grid);
            gameplayScreen.addChild(sprite);
            if (type == BEAN || type == PILL) {
                beanCount++;
            }
        }
        grids.push(rowGrids);
    }
}
//---------------------------------------------------------------------------------------------------//
function initPacman() {
    for (var i = 0; i < boardSpriteIds.length; i++) {
        for (var j = 0; j < boardSpriteIds[i].length; j++) {
            if (boardSpriteIds[i][j] == "pacman") {
                var coord = new Vector2(j, i);
                var sprite = new Container();
                var animation = setPixiAnimation("pacman_walk", 1, 0.15);
                animation.anchor.set(0.5);
                animation.rotation = 3;
                animation.play();
                animation.x = 13;
                animation.y = 13;
                sprite.addChild(animation);
                pacman = new Pacman(sprite, animation, coord, RIGHT);
                gameplayScreen.addChild(pacman.sprite);
                return;
            }
        }
    }
}
//---------------------------------------------------------------------------------------------------//
function initGhost() {
    let ghostRed;
    let ghostPink;
    let ghostBlue;
    let ghostYellow;
    for (let i = 0; i < boardSpriteIds.length; i++) {
        for (let j = 0; j < boardSpriteIds[i].length; j++) {
            if (boardSpriteIds[i][j] == "red") {
                ghostRed = getGhost(j, i, RED);
            }
            if (boardSpriteIds[i][j] == "pink") {
                ghostPink = getGhost(j, i, PINK);
            }
            if (boardSpriteIds[i][j] == "blue") {
                ghostBlue = getGhost(j, i, BLUE);
            }
            if (boardSpriteIds[i][j] == "yellow") {
                ghostYellow = getGhost(j, i, YELLOW);
            }
        }
    }
    ghosts.push(ghostRed);
    ghosts.push(ghostPink);
    ghosts.push(ghostBlue);
    ghosts.push(ghostYellow);

    chaseState = new GhostState(GHOST_CHASE, chaseTime, scatterState);
    scatterState = new GhostState(GHOST_SCATTER, scatterTime, chaseState);
    panicState = new GhostState(GHOST_PANIC, panicTime, chaseState);
    currentGhostState = chaseState;
}
//---------------------------------------------------------------------------------------------------//
function getGhost(j, i, type) {
    let coord = new Vector2(j, i);
    let sprite = new Container();
    let animation = setPixiAnimation("ghost_" + getStringFromGhostType(type) + "_walk_right", 1, 0.2);
    animation.anchor.set(0.5);
    animation.play();
    animation.x = 13;
    animation.y = 13;
    sprite.addChild(animation);
    let ghost = new Ghost(sprite, animation, coord, RIGHT, type, new Vector2(j, i));
    gameplayScreen.addChild(ghost.sprite);
    return ghost;
}
//---------------------------------------------------------------------------------------------------//
//Gameplay functions (update everyframe)
//---------------------------------------------------------------------------------------------------//
function move(target) {
    let date = new Date();
    if ((date / 1000 - target.lastMoveTime) < (1 / target.speed)) {
        return;
    }
    target.lastMoveTime = date / 1000;
    let deltaX = getDistanceDelta(target.sprite.x, getPositionFromCoordX(target.coord.x));
    let deltaY = getDistanceDelta(target.sprite.y, getPositionFromCoordY(target.coord.y));
    target.sprite.y += deltaY * 2;
    target.sprite.x += deltaX * 2;

    if (deltaX == 0 && deltaY == 0) {
        target.moveOneStep();
    }
}

//---------------------------------------------------------------------------------------------------//
function eatBean() {
    let i = pacman.coord.y;
    let j = pacman.coord.x;
    if (grids[i][j].type == BEAN || grids[i][j].type == PILL) {
        beanCount--;
        if (grids[i][j].type == PILL) {
            currentGhostState = panicState;
            addScore(50);
        } else {
            addScore(10);
        }
        grids[i][j].type = EMPTY;
        grids[i][j].sprite.texture = resources["images/empty.png"].texture;
        if (getPacmanWin()) {
            gameStart = false;
            showWinMessage();
        }
    }
}
//---------------------------------------------------------------------------------------------------//
function eatPacman() {
    let pacmanPos = new Vector2(pacman.sprite.x, pacman.sprite.y);
    for (let i = 0; i < ghosts.length; i++) {
        let ghostPos = new Vector2(ghosts[i].sprite.x, ghosts[i].sprite.y);
        if (ghosts[i].coord.x == pacman.coord.x && ghosts[i].coord.y == pacman.coord.y && getDistance(ghostPos, pacmanPos) < GRID_WIDTH) {
            if (currentGhostState.state != GHOST_PANIC) {
                lives--;
                updateLivesDisplay();
                updateAnimation(pacman.animation, "pacman_dead", 11, 0.2, false);
                gameStart = false;
                if (lives == 0) {
                    setTimeout(function() {
                        showFailMessage()
                    }, 1500);
                } else {
                    setTimeout(function() {
                        resetLevel()
                    }, 1500);
                }
            } else if (!ghosts[i].eaten) {
                ghosts[i].eaten = true;
                ghosts[i].direction = getReverseDirecion(ghosts[i].direction);
                let coordX = ghosts[i].coord.x + getMoveDeltaFromDirection(ghosts[i].direction).x;
                let coordY = ghosts[i].coord.y + getMoveDeltaFromDirection(ghosts[i].direction).y;
                ghosts[i].moveOneStep(new Vector2(coordX, coordY));
                addScore(200);
            }
        }
    }

}
//---------------------------------------------------------------------------------------------------//
//Gameplay UI
//---------------------------------------------------------------------------------------------------//
function initHub() {
    {
        let style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 20,
            fill: "white",
        });

        livesText = new Text("lives: " + lives, style);
        livesText.position.set(200, 500);
        gameplayScreen.addChild(livesText);
    } {
        let style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 20,
            fill: "white",
        });

        scoreText = new Text("Score: " + score, style);
        scoreText.position.set(15, 500);
        gameplayScreen.addChild(scoreText);
    }


}
//---------------------------------------------------------------------------------------------------//
function updateLivesDisplay() {
    livesText.text = "lives " + lives;
}
//---------------------------------------------------------------------------------------------------//
function addScore(value) {
    score += value;
    scoreText.text = "Score: " + score;
}
//---------------------------------------------------------------------------------------------------//
//Setup input
//---------------------------------------------------------------------------------------------------//
function inputSetup() {
    let left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);
    start = keyboard(83);
    left.press = () => {
        pacman.nextDirection = LEFT;
    };
    left.release = () => {};

    up.press = () => {
        pacman.nextDirection = UP;
    };
    up.release = () => {};

    right.press = () => {
        pacman.nextDirection = RIGHT;
    };
    right.release = () => {};

    down.press = () => {
        pacman.nextDirection = DOWN;
    };
    down.release = () => {};
    start.release = () => {
        if (!gameStart && titleScreen != undefined) {
            initGameStart();
        }

    }
}
//---------------------------------------------------------------------------------------------------//
//Asistant functions
//---------------------------------------------------------------------------------------------------//
function updateAnimation(animation, id, frameCount, speed, loop) {
    let textures = resources["images/spritesheet.json"].textures;
    let ids = [];
    for (let i = 0; i < frameCount; i++) {
        ids.push(textures[id + (i + 1) + ".png"]);

    }
    animation.loop = loop;
    animation.animationSpeed = speed;
    animation.textures = ids;
    animation.play();
}
//---------------------------------------------------------------------------------------------------//
function setPixiAnimation(id, frameCount, speed) {
    let textures = resources["images/spritesheet.json"].textures;
    let ids = [];
    for (let i = 0; i < frameCount; i++) {
        ids.push(textures[id + (i + 1) + ".png"]);
    }
    let animation = new PIXI.extras.AnimatedSprite(ids);
    animation.animationSpeed = speed;
    gameplayScreen.addChild(animation);
    return animation;
}
//---------------------------------------------------------------------------------------------------//
function getReverseDirecion(direction) {
    switch (direction) {
        case UP:
            return DOWN;
            break;
        case DOWN:
            return UP;
            break;
        case LEFT:
            return RIGHT;
            break;
        case RIGHT:
            return LEFT;
            break;
        default:
            break;
    }
}
//---------------------------------------------------------------------------------------------------//
function getGridType(value) {
    let type = EMPTY;
    switch (value) {
        case (value.includes("wall")):
            type = WALL;
            break;

        case "bean":
            type = BEAN;
            break;
        case "pill":
            type = PILL;
            break;
        default:
            break;
    }
    return type;
}
//---------------------------------------------------------------------------------------------------//
function xCoordWithinBorders(value) {
    let x = value;
    if (value > grids[0].length - 1) {
        x = 0;
    }
    if (x < 0) {
        x = grids[0].length - 1;
    }
    return x;
}

function yCoordWithinBorders(value) {
    let y = value;
    if (y >= grids.length) {
        y = 0
    }
    if (y < 0) {
        y = grids.length - 1;
    }
    return y;
}
//---------------------------------------------------------------------------------------------------//
function getDistanceDelta(current, next) {
    let delta = Math.sign(next - current);
    return delta;
}
//---------------------------------------------------------------------------------------------------//
function getDistance(current, next) {
    let distance = Math.sqrt(Math.pow((next.x - current.x), 2) + Math.pow(next.y - current.y, 2));
    return distance;
}
//---------------------------------------------------------------------------------------------------//
function getPositionFromCoordX(value) {
    let x = value * GRID_WIDTH;
    return x;
}

function getPositionFromCoordY(value) {
    let y = value * GRID_HEIGHT;
    return y;
}
//---------------------------------------------------------------------------------------------------//
function getMoveDeltaFromDirection(direction) {
    let deltaX = 0;
    let deltaY = 0;
    switch (direction) {
        case UP:
            deltaY = -1;
            break;

        case DOWN:
            deltaY = 1;
            break;

        case LEFT:
            deltaX = -1;
            break;

        case RIGHT:
            deltaX = 1;
            break;
        default:
            break;
    }
    let delta = new Vector2(deltaX, deltaY);
    return delta;
}
//---------------------------------------------------------------------------------------------------//
function getStringFromGhostType(value) {
    switch (value) {
        case 0:
            return "red";
            break;

        case 1:
            return "pink";
            break;

        case 2:
            return "blue";
            break;
        case 3:
            return "yellow";
        default:
            break;
    }
}
//---------------------------------------------------------------------------------------------------//
function getStringFromDirection(value) {
    switch (value) {
        case RIGHT:
            return "right";
            break;

        case LEFT:
            return "left";
            break;

        case UP:
            return "up";
            break;
        case DOWN:
            return "down";
        default:
            break;
    }
}
//---------------------------------------------------------------------------------------------------//
function Vector2(x, y) {
    this.x = x;
    this.y = y;
}
//---------------------------------------------------------------------------------------------------//