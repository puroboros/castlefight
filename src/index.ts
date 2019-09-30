import './style.css';
import * as THREE from 'three';
import './connection';
import { SpriteAnimated } from './textures/sprite-animated';
require ('./assets/q.jpg');
require ('./assets/w.png');

// create the scene
const scene = new THREE.Scene();

// create the camera
const camera = new THREE.PerspectiveCamera(105, 1, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();

// set size
renderer.setSize(window.innerWidth, window.innerHeight);

// add canvas to dom
document.body.appendChild(renderer.domElement);

// add axis to the scene
const axis = new THREE.AxesHelper(10);

//scene.add(axis);

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
const movingImage = spriteAnimated.loadImage('./assets/try4.png', 1, 1, 8, 15, 100, 8);
spriteAnimated.setScale(10, 10, 1);
spriteAnimated.setTranslation(-50,-10,0);
spriteAnimated.setNumRow(6);
scene.add( movingImage );

const secondSprite = new SpriteAnimated();
const secondMovingImage = secondSprite.loadImage('./assets/q.jpg', 1, 1, 4, 4, 100, 10);
secondSprite.setScale(10, 10, 1);
//scene.add( secondMovingImage );

const thirdSprite = new SpriteAnimated();
const thirdMovingImage = thirdSprite.loadImage('./assets/v.png', 1, 1, 10, 8, 100, 10);
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
	//spriteAnimated.setTranslation(-50,-10,0);
	//thirdSprite.setTranslation(50,-10,0);
	renderer.render(scene, camera);
}

animate();
