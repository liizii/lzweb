//---------------------------------------------------------------------------------------------------//
function Grid(sprite, coord, directionOptions, type) {
    this.sprite = sprite;
    this.coord = coord;
    this.directionOptions = directionOptions;
    this.type = type;
}
//---------------------------------------------------------------------------------------------------//
function getGridImageId(value) {
    let id = value;
    if (value == "pacman" || value == "red" || value == "blue" || value == "pink" || value == "yellow") {
        id = "empty";
    }
    return id;
}
//---------------------------------------------------------------------------------------------------//
function getGridDirectionOptions(value) {
    let options = [EMPTY];
    switch (value) {
        case -1:
            options = [WALL];
            break;
        case 1:
            options = [RIGHT, DOWN];
            break;
        case 2:
            options = [LEFT, DOWN];
            break;
        case 3:
            options = [RIGHT, UP];
            break;
        case 4:
            options = [LEFT, UP];
            break;
        case 5:
            options = [RIGHT, DOWN, UP];
            break;
        case 6:
            options = [LEFT, DOWN, UP];
            break;
        case 7:
            options = [RIGHT, DOWN, LEFT];
            break;
        case 8:
            options = [RIGHT, LEFT, UP];
            break;
        case 9:
            options = [RIGHT, LEFT, DOWN, UP];
            break;
        default:
            break;
    }
    return options;
}
//---------------------------------------------------------------------------------------------------//