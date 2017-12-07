export const COLS          = 30;
export const ROWS          = 30;
export const GAP_SIZE      = 1;
export const CELL_SIZE     = 10;
export const CANVAS_WIDTH  = COLS * ( CELL_SIZE + GAP_SIZE );
export const CANVAS_HEIGHT = ROWS * ( CELL_SIZE + GAP_SIZE );

export function createCanvasElement() {
    const canvas = document.createElement( 'canvas' );
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    return canvas;
}

export function render( ctx, scene ) {
    renderBackground( ctx, scene.score );
    renderSnake( ctx, scene.snake );
    renderApples( ctx, scene.apples );
}

export function renderBackground( ctx, score ) {
    ctx.fillStyle = 'rgba( 251,251,251, .2 )';
    ctx.fillRect( 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT );

    if( !score ) return;
    ctx.font = '24px serif';
    ctx.fillStyle = 'green';
    ctx.fillText( `${score}`, 24, 24 );
}

export function renderSnake( ctx, snake ) {
    snake.forEach( ( segment, index ) => paintCell( ctx, wrapBounds( segment ), getSegmentColor( index ) ) );
}

export function renderApples( ctx, apples ) {
    apples.forEach( point => {
        paintCell( ctx, point, 'red' );
    } );
}

export function paintCell( ctx, point, color ) {
    const x = point.x * ( CELL_SIZE + GAP_SIZE );
    const y = point.y * ( CELL_SIZE + GAP_SIZE );

    ctx.fillStyle = color;
    ctx.fillRect( x, y, CELL_SIZE, CELL_SIZE );
}

export function wrapBounds( point ) {
    const x = point.x >= COLS ? 0 : point.x < 0 ? COLS - 1 : point.x;
    const y = point.y >= ROWS ? 0 : point.y < 0 ? ROWS - 1 : point.y;

    point.x = x;
    point.y = y;

    return point;
}

export function getSegmentColor( index ) {
    const color = `#366bf3`;
    return index === 0 ? 'black' : color;
}

export function checkCollision(a, b) {
    return a.x === b.x && a.y === b.y;
}

export function checkSnakeCollision( snake = [] ) {
    const [ head, ...tail ]= snake;
    const res = tail.some( part => checkCollision( part, head ) );
    return !res;
}