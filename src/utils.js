import { SNAKE_LENGTH, APPLE_COUNT } from "./constants";
import { COLS, ROWS, checkCollision } from './canvas';

export function generateSnake() {
    let snake = [];

    for ( let i = SNAKE_LENGTH - 1; i >= 0; i-- ) {
        snake.push( { x: i, y: 0 } );
    }

    return snake;
}

export function move( snake, { direction, snakeLength } ) {
    let nx = snake[ 0 ].x;
    let ny = snake[ 0 ].y;

    nx += direction.x;
    ny += direction.y;

    let tail = {};
    if( snakeLength > snake.length ){
        tail.x = nx;
        tail.y = ny;
    } else {
        tail = snake.pop();
        tail.x = nx;
        tail.y = ny;
    }

    snake.unshift( tail );

    return snake;
}

export function nextDirection( previous, next ) {
    const isOpposite = ( previous, next ) => {
        return next.x === -previous.x || next.y === -previous.y;
    };

    if ( isOpposite( previous, next ) ) {
        return previous;
    }

    return next;
}

export function generateApples() {
    let apples = [];

    for ( let i = 0; i < APPLE_COUNT; i++ ) {
        apples.push( getRandomPosition() );
    }

    return apples;
}


export function getRandomPosition(snake = []) {
    let position = {
        x: getRandomNumber(0, COLS - 1),
        y: getRandomNumber(0, ROWS - 1)
    };

    if (isEmptyCell(position, snake)) {
        return position;
    }

    return getRandomPosition(snake);
}

function isEmptyCell( position, snake ) {
    return !snake.some( segment => checkCollision( segment, position ) );
}

function getRandomNumber( min, max ) {
    return Math.floor( Math.random() * (max - min + 1) + min );
}

export function eat( apples, snake ) {
    let head = snake[ 0 ];

    for ( let i = 0; i < apples.length; i++ ) {
        if ( checkCollision( apples[ i ], head ) ) {
            apples.splice( i, 1 );
            return [ ...apples, getRandomPosition( snake ) ];
        }
    }

    return apples;
}