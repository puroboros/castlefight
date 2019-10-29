import * as THREE from 'three';

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
    private sprite: THREE.Sprite;
    constructor() {
    }

    loadImage(image: string, frameHeight: number, frameWidth: number, framesX: number, framesY: number, frameDelay: number, endFrame: number) {
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
        /*this.canvasTexture = new THREE.CanvasTexture(this.canvas);
        this.canvas.width = this.frameWidth = img.width / this.framesX;
        this.canvas.height = this.frameHeight = img.height / this.framesY;*/
        this.texture = new THREE.TextureLoader().load(image);
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
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
        console.log('intervallllll');
        this.count++;

        if (this.count >= this.endFrame) {
            this.count = 0;
        };

        this.texture.offset.x = this.count/this.framesX;
        this.texture.offset.y = this.numRow/this.framesY;
        console.log('count: ' + this.count);
        console.log('x: ' + this.x);
        console.log('y: ' + this.y);
        console.log('framesX: ' + this.framesX);
        console.log('frameHeight: ' + this.frameHeight);
        console.log('frameWidth: ' + this.frameWidth);
        // this.context.clearRect(0, 0, this.frameWidth, this.frameHeight);
        // this.context.drawImage(this.img, this.x, this.y, this.frameWidth, this.frameHeight, 0, 0, this.frameWidth, this.frameHeight);
        

        // this.canvasTexture.needsUpdate = true;
    }

    setNumRow(numRow: number){
        if(numRow > this.framesY || numRow < 0){
            this.numRow = 0;
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
}
