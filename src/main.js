import { Observable, BehaviorSubject } from 'rxjs';
import { animationFrame } from 'rxjs/scheduler/animationFrame';

import { checkSnakeCollision, createCanvasElement, render } from "./canvas";
import { DIRECTIONS, FPS, POINTS_PER_APPLE, SNAKE_LENGTH, SPEED } from "./constants";
import { generateApples, generateSnake, move, nextDirection, eat } from "./utils";

const INITIAL_DIRECTION = DIRECTIONS[ 40 ];

const canvas = createCanvasElement();
const ctx = canvas.getContext( '2d' );
document.body.appendChild( canvas );


let keyDown$ = Observable.fromEvent( document.body, 'keydown' );

let tick$ = Observable.interval( SPEED );

let direction$ = keyDown$
    .map( ( e ) => DIRECTIONS[ e.keyCode ] )
    .filter( direction => !!direction )
    .startWith( INITIAL_DIRECTION )
    .scan( nextDirection )
    .distinctUntilChanged();

let length$ = new BehaviorSubject( SNAKE_LENGTH );
let snakeLength$ = length$
    .scan( ( step, snakeLength ) => { return step + snakeLength } )
;

let snake$ = tick$
    .withLatestFrom( direction$, snakeLength$, ( _, direction, snakeLength ) => ({ direction, snakeLength }) )
    .scan( move, generateSnake() )
    .share();

let apples$ = snake$
    .scan( eat, generateApples() )
    .distinctUntilChanged()
    .share()
;

let applesEaten = apples$
    .skip( 1 )
    .map( _ => 1 )
    .do( ::length$.next )
    .subscribe();

let score$ = length$
    .skip( 1 )
    .startWith( 0 )
    .scan( ( score, _ ) => score + POINTS_PER_APPLE );

let scene$ = Observable.combineLatest( snake$, apples$, score$, ( snake, apples, score ) => ({ snake, apples, score }) );

let game$ = Observable.interval( 1000 / FPS, animationFrame )
    .withLatestFrom( scene$, ( _, scene ) => scene )
    .takeWhile( scene => checkSnakeCollision( scene.snake ) )
;

game$.subscribe( {
    next: ( scene ) => render( ctx, scene ),
    complete: console.log
} );

window.ctx = ctx;
window.render = render;
window.game$ = game$;

