import * as THREE from 'three';
import { NearestFilter, NearestMipMapNearestFilter, Vector3 } from 'three';

export class SpriteAnimated {
    private endFrame: number = 0;
    private framesX: number = 0;
    private framesY: number = 0;
    private numRow: number = 0;
    private frameWidth: number = 0;
    private frameHeight: number = 0;
    private frameDelay: number = 0;
    private count: number = 0;
    private x: number = 0;
    private y: number = 0;
    private timer: any;
    private texture?: THREE.Texture;
    private material?: THREE.SpriteMaterial;
    public sprite?: THREE.Sprite;
    private initialFrame: number = 0;
    public isMoving: boolean = false;
    public destiny?: Vector3;
    public id: number = 0;
    constructor() {
    }

    loadImage(image: string, frameHeight: number, frameWidth: number, framesX: number, framesY: number, frameDelay: number, endFrame: number, anisotropy: number) {
        if (this.timer) {
            if (this.material) {
                this.material.dispose();
            }
            if (this.texture) {
                this.texture.dispose();
            }
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
        this.texture.repeat.set(1 / framesX, 1 / framesY);
        this.material = new THREE.SpriteMaterial({ map: this.texture, color: 0xffffff });
        this.sprite = new THREE.Sprite(this.material);
        this.timer = setInterval(this.nextFrame.bind(this), this.frameDelay);
        return this.sprite;

    }

    setScale(x: number, y: number, z: number) {
        if (this.sprite) {
            this.sprite.scale.set(x, y, z);
        }
    }
    setTranslation(x: number, y: number, z: number) {
        if (this.sprite) {
            this.sprite.translateX(x);
            this.sprite.translateY(y);
            this.sprite.translateZ(z);
        }
    }

    private nextFrame() {
        this.count++;

        if (this.count >= (this.endFrame + this.initialFrame)) {
            this.count = this.initialFrame;
        };
        if (this.texture) {
            this.texture.offset.x = this.count / this.framesX;
            this.texture.offset.y = this.numRow / this.framesY;
        }
    }

    setNumRow(numRow: number) {
        if (numRow >= this.framesY + this.initialFrame || numRow < 0) {
            this.numRow = this.initialFrame;
        }
        else {
            this.numRow = numRow;
        }
    }

    setFramesX(framesX: number) {
        this.framesX = framesX;
    }

    setEndFrame(endFrame: number) {
        this.endFrame = endFrame;
    }

    flipSpriteRads(rads: number) {
        if (this.texture) {
            this.texture.rotation = Math.PI * rads;
        }
    }

    flipSpriteY() {
        this.initialFrame = (this.initialFrame + 1) % 2;
        if (this.texture) {
            this.texture.flipY = false;
        }
    }
    getSpriteMaterial() {
        return this.material;
    }
    getSprite() {
        return this.sprite;
    }
    getNumRow() {
        return this.numRow;
    }
    getInitialFrame() {
        return this.initialFrame;
    }
    startMoving(destiny: Vector3) {
        this.isMoving = true;
        this.destiny = destiny;
        this.setFramesX(8);
        this.setEndFrame(8);
        this.setNumRow(4);
    }
    stopMoving() {
        this.isMoving = false;
        this.setFramesX(9);
        this.setEndFrame(9);
        this.setNumRow(5);
    }
}
