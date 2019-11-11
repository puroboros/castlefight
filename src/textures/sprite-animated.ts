import * as THREE from 'three';
import { LinearMipMapLinearFilter, LinearMipMapNearestFilter, LinearFilter, NearestFilter, NearestMipMapNearestFilter, NearestMipMapLinearFilter, Vec2, Vector3 } from 'three';

export class SpriteAnimated {
    private endFrame: number;
    private framesX: number;
    private framesY: number;
    private numRow: number = 0;
    private frameWidth: number;
    private frameHeight: number;
    private frameDelay: number;
    private count: number = 0;
    private x: number = 0;
    private y: number = 0;
    private timer: any;
    private texture: THREE.Texture;
    private material: THREE.SpriteMaterial;
    public sprite: THREE.Sprite;
    private initialFrame: number = 0;
    public isMoving: boolean = false;
    public destiny: Vector3;
    constructor() {
    }

    loadImage(image: string, frameHeight: number, frameWidth: number, framesX: number, framesY: number, frameDelay: number, endFrame: number, anisotropy: number) {
        if (this.timer) {
            this.material.dispose();
            this.texture.dispose();
        }
        this.endFrame = endFrame;
        this.frameDelay = frameDelay;
        this.frameHeight = frameHeight;
        this.frameWidth = frameWidth;
        this.framesX = framesX;
        this.framesY = framesY;
        this.x = 0;
        this.y = 0;
        this.count = 0;
        this.texture = new THREE.TextureLoader().load(image);
        this.texture.minFilter = NearestFilter;
        this.texture.magFilter = NearestMipMapNearestFilter;
        this.texture.anisotropy = anisotropy;
        this.texture.repeat.set(1/framesX, 1/framesY);
        this.material = new THREE.SpriteMaterial({ map: this.texture, color: 0xffffff });
        this.sprite = new THREE.Sprite(this.material);
        this.timer = setInterval(this.nextFrame.bind(this), this.frameDelay);
        return this.sprite;
        
    }

    setScale(x: number, y: number, z: number){
        this.sprite.scale.set(x, y, z); 
    }
    setTranslation(x: number, y: number, z: number){
        this.sprite.translateX(x);
        this.sprite.translateY(y);
        this.sprite.translateZ(z);
    }

    private nextFrame() {
        this.count++;

        if (this.count >= (this.endFrame+ this.initialFrame)) {
            this.count = this.initialFrame;
        };
        
        this.texture.offset.x = this.count/this.framesX;
        this.texture.offset.y = this.numRow/this.framesY;
    }

    setNumRow(numRow: number){
        if(numRow >= this.framesY+this.initialFrame || numRow < 0){
            this.numRow = this.initialFrame;
        }
        else{
            this.numRow = numRow;
        }
    }

    setFramesX(framesX: number){
        this.framesX = framesX;
    }

    setEndFrame(endFrame: number){
        this.endFrame = endFrame;
    }

    flipSpriteRads(rads: number){
        this.texture.rotation = Math.PI*rads;
    }

    flipSpriteY(){
        this.initialFrame = (this.initialFrame + 1) % 2;
        this.texture.flipY = false;
    }
    getSpriteMaterial(){
        return this.material;
    }
    getSprite(){
        return this.sprite;
    }
    getNumRow(){
        return this.numRow;
    }
    getInitialFrame(){
        return this.initialFrame;
    }
    startMoving(destiny: Vector3){
        this.isMoving = true;
        this.destiny = destiny;
        this.setFramesX(8);
        this.setEndFrame(8);
        this.setNumRow(4);
    }
    stopMoving(){
        this.isMoving = false;
        this.setFramesX(9);
        this.setEndFrame(9);
        this.setNumRow(5);
    }
}
