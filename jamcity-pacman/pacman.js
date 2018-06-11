//---------------------------------------------------------------------------------------------------//
function Pacman(sprite, animation, coord, direction) {
    this.coord = coord;
    this.sprite = sprite;
    sprite.x = getPositionFromCoordX(coord.x);
    sprite.y = getPositionFromCoordY(coord.y);
    this.direction = direction;
    this.nextDirection = direction;
    this.lastMoveTime = 0;
    this.speed = speed;
    this.animation = animation;
}
//---------------------------------------------------------------------------------------------------//
Pacman.prototype.moveOneStep = function() {

    let directionOptions = grids[this.coord.y][this.coord.x].directionOptions;

    for (let i = 0; i < directionOptions.length; i++) {
        if (this.nextDirection != undefined) {
            let xNext = this.coord.x + getMoveDeltaFromDirection(this.nextDirection).x;
            let yNext = this.coord.y + getMoveDeltaFromDirection(this.nextDirection).y;
            if (grids[yNext][xNext].directionOptions.length > 0 && grids[yNext][xNext].directionOptions[0] != WALL) {
                this.direction = this.nextDirection;
                this.nextDirection = undefined;
                break;
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

    let pauseMoving = false;
    if (grids[y][x].directionOptions.length == 1 && grids[y][x].directionOptions[0] == WALL) {
        x = this.coord.x;
        y = this.coord.y;
        pauseMoving = true;
    }

    this.coord.x = x;
    this.coord.y = y;
    this.updateAnimationDirection(pauseMoving);
}
//---------------------------------------------------------------------------------------------------//
Pacman.prototype.updateAnimationDirection = function(pauseMoving) {
    if (pauseMoving) {
        updateAnimation(this.animation, "pacman_walk", 1, 0.3, false);
        return;
    }
    if (this.animation.textures.length < 4) {
        updateAnimation(this.animation, "pacman_walk", 4, 0.25, true);
    }

    switch (this.direction) {
        case UP:
            this.animation.rotation = 1.5;
            break;
        case DOWN:
            this.animation.rotation = 4.75;
            break;
        case LEFT:
            this.animation.rotation = 0;
            break;
        case RIGHT:
            this.animation.rotation = 3;
            break;
        default:
            break;
    }
}
//---------------------------------------------------------------------------------------------------//