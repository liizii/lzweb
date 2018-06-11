//---------------------------------------------------------------------------------------------------//
function Ghost(sprite, animation, coord, direction, type, startCoord) {
    this.sprite = sprite;
    sprite.x = getPositionFromCoordX(coord.x);
    sprite.y = getPositionFromCoordY(coord.y);
    this.coord = coord;
    this.direction = direction;
    this.type = type;
    this.lastMoveTime = 0;
    this.startCoord = startCoord;
    this.speed = speed;
    this.eaten = false;
    this.animation = animation;
}
//---------------------------------------------------------------------------------------------------//
function GhostState(state, duration, nextState) {
    this.state = state;
    this.duration = duration;
    this.nextState = nextState;
}
//---------------------------------------------------------------------------------------------------//
Ghost.prototype.moveOneStep = function(value) {

    if (value != undefined) {
        this.coord.x = value.x;
        this.coord.y = value.y
        return;
    }

    for (let i = 0; i < ghosts.length; i++) {
        if (this.coord.x == ghosts[i].startCoord.x && this.coord.y == ghosts[i].startCoord.y) {
            this.eaten = false;
        }
    }

    this.setSpeedBasedOnState();

    let directionOptions = grids[this.coord.y][this.coord.x].directionOptions;
    directionOptions = this.removeOppositeDirection(directionOptions, this.direction);

    if (directionOptions.length > 0) {
        let target = this.findTargetCoord();
        let distances = [];

        for (let i = 0; i < directionOptions.length; i++) {
            let nextX = this.coord.x + getMoveDeltaFromDirection(directionOptions[i]).x;
            let nextY = this.coord.y + getMoveDeltaFromDirection(directionOptions[i]).y;
            let distance = getDistance(new Vector2(nextX, nextY), target);
            distances.push(distance);
        }

        let min = distances[0];
        let minIndex = 0;
        for (let i = 0; i < distances.length; i++) {
            if (distances[i] < min) {
                min = distances[i];
                minIndex = i;
            }
        }
        this.direction = directionOptions[minIndex];
    }

    //when ghost stays at home
    if (currentGhostState.state != GHOST_PANIC || !this.eaten) {

        for (let i = 0; i < ghosts.length; i++) {
            let gx = ghosts[i].startCoord.x;
            let gy = ghosts[i].startCoord.y;
            if (this.coord.x == gx && this.coord.y == gy) {

                if ((gx == 8 && gy == 9) || (gx == 9 && gy == 7)) {
                    this.direction = RIGHT;
                }
                if (gx == 9 && gy == 9) {
                    this.direction = UP;
                    break;
                }
                if (gx == 10 && gy == 9) {
                    this.direction = LEFT;
                    break;
                }
            }
        }
    }

    let x = this.coord.x + getMoveDeltaFromDirection(this.direction).x;
    let y = this.coord.y + getMoveDeltaFromDirection(this.direction).y;

    let xNew = xCoordWithinBorders(x);
    let yNew = yCoordWithinBorders(y);
    if (x != xNew) {
        x = xNew;
        this.sprite.x = getPositionFromCoordX(x);
    }
    if (y != yNew) {
        y = yNew;
        this.sprite.y = getPositionFromCoordX(y);
    }

    if (grids[y][x].directionOptions.length == 1 && grids[y][x].directionOptions[0] == WALL) {
        x = this.coord.x;
        y = this.coord.y;
    }

    this.coord.x = x;
    this.coord.y = y;
    this.updateSprites();
}
//---------------------------------------------------------------------------------------------------//
Ghost.prototype.updateSprites = function(value) {
    if (currentGhostState.state == GHOST_PANIC) {
        if (this.eaten) {
            let id = "ghost_eaten_" + getStringFromDirection(this.direction);
            updateAnimation(this.animation, id, 1, 0.1, false);
        } else {
            let id = "ghost_panic";
            let count = 2;
            if (timestamp - ghostStateStartTime > currentGhostState.duration - 2) {
                count = 4;
            }
            updateAnimation(this.animation, id, count, 0.1, false);

        }
    } else {
        let id = "ghost_" + getStringFromGhostType(this.type) + "_walk_" + getStringFromDirection(this.direction);
        updateAnimation(this.animation, id, 2, 0.1, true);
    }
}
//---------------------------------------------------------------------------------------------------//
Ghost.prototype.setSpeedBasedOnState = function() {
    switch (currentGhostState.state) {
        case GHOST_PANIC:
            this.speed = speed * 0.3;
            if (this.eaten) {
                this.speed = speed * 5;
            }
            break;
        case GHOST_CHASE:
            this.speed = speed;
            break;
        case GHOST_SCATTER:
            this.speed = speed;
            break;
        default:
            break;
    }
}
//---------------------------------------------------------------------------------------------------//
Ghost.prototype.removeOppositeDirection = function(directions, currentDirection) {
    var oppositeDirection;
    switch (currentDirection) {
        case UP:
            oppositeDirection = DOWN;
            break;
        case DOWN:
            oppositeDirection = UP;
            break;
        case LEFT:
            oppositeDirection = RIGHT;
            break;
        case RIGHT:
            oppositeDirection = LEFT;
            break;
        default:
            break;
    }
    var newDirections = [];
    for (var i = 0; i < directions.length; i++) {
        if (directions[i] != oppositeDirection && directions[i] != WALL && directions[i] != EMPTY) {
            newDirections.push(directions[i]);
        }
    }
    return newDirections;
}
//---------------------------------------------------------------------------------------------------//
Ghost.prototype.findTargetCoord = function() {
    let x = this.startCoord.x;
    let y = this.startCoord.y;

    let accuracy = Math.random();
    if (currentGhostState.state == GHOST_CHASE && accuracy < ghostAccuracyRate) {
        switch (this.type) {
            case RED:
                x = pacman.coord.x;
                y = pacman.coord.y;
                break;
            case PINK:
                x = pacman.coord.x + 4 * getMoveDeltaFromDirection(pacman.direction).x;
                y = pacman.coord.y + 4 * getMoveDeltaFromDirection(pacman.direction).x;
                break;
            case BLUE:
                let pacmanX = pacman.coord.x + 2 * getMoveDeltaFromDirection(pacman.direction).x;
                let ghostX = ghosts[RED].coord.x;
                x = ghostX - (ghostX - pacmanX) * 2;
                let pacmanY = pacman.coord.y + 2 * getMoveDeltaFromDirection(pacman.direction).y;
                let ghostY = ghosts[RED].coord.y;
                y = ghostY - (ghostY - pacmanY) * 2;
                break;
            case YELLOW:
                if (getDistance(pacman.coord, ghosts[YELLOW]) < 8) {
                    x = 0;
                    y = grids.length - 1;
                } else {
                    x = pacman.coord.x;
                    y = pacman.coord.y;
                }
                break;
            default:
                break;
        }
    } else if (currentGhostState.state == GHOST_SCATTER) {
        switch (this.type) {
            case RED:
                x = grids[0].length - 1;
                y = 0;
                break;
            case PINK:
                x = 0;
                y = 0;
                break;
            case BLUE:
                x = grids[0].length - 1;
                y = grids.length - 1;
                break;
            case YELLOW:
                x = 0;
                y = grids.length - 1;

                break;
            default:
                break;
        }
    } else if (currentGhostState.state == GHOST_PANIC) {
        if (!this.eaten) {
            x = pacman.coord.x - (pacman.coord.x - 9) * 2;
            y = pacman.coord.y - (pacman.coord.y - 9) * 2;
        } else {
            x = this.startCoord.x;
            y = this.startCoord.y;
        }
    }
    return new Vector2(x, y);
}
//---------------------------------------------------------------------------------------------------//