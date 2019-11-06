import './style.css';
import * as THREE from 'three';
import './connection';
import { SpriteAnimated } from './textures/sprite-animated';
import {SocketConnector} from './connection';

require ('./assets/q.jpg');
require ('./assets/w.png');

window.onload = () =>{
	
	document.onmouseout = mouseCachePoistionCameraListen
	document.onmousemove = mouseMoveCameraListen;
	document.onkeydown = keyListen;
	document.onwheel = scrollDirection;
	document.getElementById('leftcam').onclick = moveCamToLeft;
	document.getElementById('rightcam').onclick = moveCamToRight;
	document.getElementById('zoomout').onclick = moveCamToCloser;
	document.getElementById('zoomin').onclick = moveCamToFarther;
	document.getElementById('upcam').onclick = moveCamToUp;
	document.getElementById('downcam').onclick = moveCamToDown;
	document.getElementById('centercam').onclick = centerCamera;
	document.getElementById('fullscreen').onclick = fullScreen;
	document.getElementById('closefullscreen').onclick = closeFullScreen;
	
}

const elem = document.documentElement;

const socketConnector = new SocketConnector();

socketConnector.send('hola');

// create the scene
const scene = new THREE.Scene();

// create the camera
const camera = new THREE.PerspectiveCamera(105, 1, 0.1, 1000);
let constantMoveLeftCamera = false;
let constantMoveRightCamera = false;
let constantMoveUpCamera = false;
let constantMoveDownCamera = false;
let maxCoordCameraLeft = -100;
let maxCoordCameraRight = 100;
let maxCoordCameraUp = 40;
let maxCoordCameraDown = -40;


let renderer = new THREE.WebGLRenderer();



// set size
renderer.setSize(window.innerWidth, window.innerHeight-4);



// add canvas to dom
document.body.appendChild(renderer.domElement);


//scene.add(axis);
const axis = new THREE.AxesHelper(10);

// add lights
const light = new THREE.DirectionalLight(0xffffff, 1.0);

light.position.set(100, 100, 100);

scene.add(light);

const light2 = new THREE.DirectionalLight(0xffffff, 1.0);

light2.position.set(-100, 100, -100);

scene.add(light2);

const material = new THREE.MeshBasicMaterial({
	color: 0xaaaaaa,
	wireframe: true
});

//MAXGUARREANDING
const spriteAnimated = new SpriteAnimated();
const movingImage = spriteAnimated.loadImage('./assets/qw.png', 1, 1, 18, 13, 100, 18, renderer.getMaxAnisotropy());
spriteAnimated.setScale(10, 10, 1);
spriteAnimated.setTranslation(-50,-10,0);
spriteAnimated.setNumRow(6);
scene.add( movingImage );


var map = new THREE.TextureLoader().load( "q3.png" );
var material2 = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
var sprite = new THREE.Sprite( material2 );
scene.add( sprite );
sprite.scale.set(1,1,1);



const thirdSprite = new SpriteAnimated();
const thirdMovingImage = thirdSprite.loadImage('./assets/v.png', 1, 1, 10, 8, 100, 10, renderer.getMaxAnisotropy());
thirdSprite.flipSpriteY();
thirdSprite.flipSpriteRads(1);
thirdSprite.setEndFrame(11);
thirdSprite.setNumRow(1);
thirdSprite.setFramesX(11);
thirdSprite.setScale(10, 10, 1);
thirdSprite.setTranslation(50,-10,0);
scene.add( thirdMovingImage );


// create a box and add it to the scene
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

//scene.add(box);

box.position.x = 0.5;
box.rotation.y = 0.5;

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 50;

camera.lookAt(scene.position);

function animate(): void {
	requestAnimationFrame(animate);
	render();
}

function render(): void {
	if(constantMoveLeftCamera){
		camera.position.x = Math.max(camera.position.x-1,maxCoordCameraLeft);
	}
	if(constantMoveRightCamera){
		camera.position.x = Math.min(camera.position.x+1,maxCoordCameraRight);
	}
	if(constantMoveUpCamera){
		camera.position.y = Math.min(camera.position.y+1,maxCoordCameraUp);
	}
	if(constantMoveDownCamera){
		camera.position.y = Math.max(camera.position.y-1,maxCoordCameraDown);
	}
	renderer.render(scene, camera);
}

function moveCamToLeft(){
	moveCam(-1,0,0);
}

function moveCamToRight(){
	moveCam(1,0,0);
}

function moveCamToUp(){
	moveCam(0,1,0);
}

function moveCamToDown(){
	moveCam(0,-1,0);
}

function moveCamToCloser(){
	moveCam(0,0,-1);
}

function moveCamToFarther(){
	moveCam(0,0,1);
}

function moveCam(tweakX: number, tweakY: number, tweakZ: number){
	camera.position.x += tweakX;
	camera.position.y += tweakY;
	camera.position.z += tweakZ;
}

function keyListen(e: KeyboardEvent){
    if (e.keyCode === 38) {
        moveCamToUp();
    }
    else if (e.keyCode === 40) {
        moveCamToDown();
    }
    else if (e.keyCode === 37) {
       moveCamToLeft();
    }
    else if (e.keyCode === 39) {
       moveCamToRight();
	}
	else if (e.keyCode === 107) {
		moveCamToCloser();
	}
	else if (e.keyCode === 109) {
		moveCamToFarther();
	}
}

function mouseMoveCameraListen(e: MouseEvent){
	if(e.x<1){
		constantMoveLeftCamera = true;
	}
	else{
		constantMoveLeftCamera = false;
	}
	if(e.y<1){
		constantMoveUpCamera = true;
	}
	else{
		constantMoveUpCamera = false;
	}
	if(e.x>screen.width-10){
		constantMoveRightCamera = true;
	}
	else{
		constantMoveRightCamera = false;
	}
	if(e.y>window.innerHeight-10){
		constantMoveDownCamera = true;
	}
	else{
		constantMoveDownCamera = false;
	}
}

function mouseCachePoistionCameraListen(e: MouseEvent){
	if(e.x<1){
		constantMoveLeftCamera = true;
	}
	else{
		constantMoveLeftCamera = false;
	}
	if(e.y<1){
		constantMoveUpCamera = true;
	}
	else{
		constantMoveUpCamera = false;
	}
	if(e.x>screen.width-10){
		constantMoveRightCamera = true;
	}
	else{
		constantMoveRightCamera = false;
	}
	if(e.y>window.innerHeight-10){
		constantMoveDownCamera = true;
	}
	else{
		constantMoveDownCamera = false;
	}
}

function centerCamera(){
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 50;
}

function fullScreen(){
	renderer.setSize(screen.width,screen.height-4);
	document.documentElement.requestFullscreen();
}

function closeFullScreen(){
	document.exitFullscreen();
	setTimeout(()=>{ renderer.setSize(window.innerWidth, window.innerHeight-4) }, 100);
	
}

function scrollDirection(e: WheelEvent){
	if(e.deltaY<0 && camera.position.z >1){
		moveCamToCloser();
	}
	else if(e.deltaY>0 && camera.position.z < 200){
		moveCamToFarther();
	}
}
animate();
