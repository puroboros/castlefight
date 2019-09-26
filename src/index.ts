// add styles
import './style.css';
// three.js
import * as THREE from 'three';

import './connection';
require ('./assets/e.png');
// create the scene
const scene = new THREE.Scene();

// create the camera
const camera = new THREE.PerspectiveCamera(105, 1, 0.1, 1000);
//const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer();

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
var spriteMap = new THREE.TextureLoader().load( "./assets/g.png" );
var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
var sprite = new THREE.Sprite( spriteMaterial);
var qwe = new THREE.SpriteMaterial( );
var asd = new THREE.Sprite(qwe);
asd.scale.set(7, 10, 1);
scene.add(asd);
sprite.scale.set(50, 10, 1);
//scene.add( sprite );

/*var runnerMaterial = new THREE.MeshBasicMaterial( { map: spriteMap, side:THREE.DoubleSide } );
var runnerGeometry = new THREE.PlaneGeometry(50, 10, 1, 1);
var runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
runner.position.set(0,0,0);
scene.add(runner);*/

sprite.position.y = 5;
sprite.position.x = 0;
let contador = 0;



// create a box and add it to the scene
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

scene.add(box);

box.position.x = 0.5;
box.rotation.y = 0.5;

camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 20;

camera.lookAt(scene.position);

function animate(): void {
	requestAnimationFrame(animate);
	render();
}

function render(): void {
	//const timer = 0.002 * Date.now();
	//box.position.y = 1;
	//box.position.x = (box.position.x + 0.05)%10 ;
	//box.rotation.x += 0.1;
	//sprite.position.x = (sprite.position.x + 0.01)%10;
	//contador = contador + 1;
	//spriteMap.offset.x = ((contador%10)/100);
	spriteMap.offset.x = (0.0);
	spriteMap.offset.y = 0;
	renderer.render(scene, camera);
}

animate();

