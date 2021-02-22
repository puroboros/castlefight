import * as THREE from 'three';
import { SpriteAnimated } from '../textures/sprite-animated';
import { Object3D, Sprite } from 'three';
import { Subject } from 'rxjs';

export class View {
    elem: any;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    axis: THREE.AxesHelper;
    private emitter: Subject<any> = new Subject<any>();
    get eventEmitter() {
        return this.emitter.asObservable();
    }
    animatedEntities: SpriteAnimated[] = [];

    constantMoveLeftCamera = false;
    constantMoveRightCamera = false;
    constantMoveUpCamera = false;
    constantMoveDownCamera = false;
    maxCoordCameraLeft = -100;
    maxCoordCameraRight = 100;
    maxCoordCameraUp = 40;
    maxCoordCameraDown = -40;

    imageNumber = 3;
    selectedImage = 0;

    constructor() {
        document.onmouseout = this.mouseCachePoistionCameraListen.bind(this);
        document.onmousemove = this.mouseMoveCameraListen.bind(this);
        document.onkeydown = this.keyListen.bind(this);
        document.onwheel = this.scrollDirection.bind(this);
        this.elem = document.documentElement;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(105, 1, 0.1, 1000);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 50;
        this.camera.lookAt(this.scene.position);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight - 4);
        document.body.appendChild(this.renderer.domElement);
        this.axis = new THREE.AxesHelper(10);
        this.addLightsToScene();

        document.getElementsByTagName('canvas')[0].oncontextmenu = (event) => this.readClick(event);
        document.getElementsByTagName('canvas')[0].onclick = (event) => this.readClick(event);
        const leftCam = document.getElementById('leftcam');
        if (leftCam) {
            leftCam.onclick = () => this.moveCamToLeft();
        }
        const rightCam = document.getElementById('rightcam');
        if (rightCam) {
            rightCam.onclick = () => this.moveCamToRight();
        }
        const zoomOut = document.getElementById('zoomout');
        if (zoomOut) {
            zoomOut.onclick = () => this.moveCamToCloser();
        }
        const zoomIn = document.getElementById('zoomin');
        if (zoomIn) {
            zoomIn.onclick = () => this.moveCamToFarther();
        }
        const upCam = document.getElementById('upcam');
        if (upCam) {
            upCam.onclick = () => this.moveCamToUp();
        }
        const downCam = document.getElementById('downcam');
        if (downCam) {
            downCam.onclick = () => this.moveCamToDown();
        }
        const centerCam = document.getElementById('centercam');
        if (centerCam) {
            centerCam.onclick = () => this.centerCamera();
        }
        const fullScreen = document.getElementById('fullscreen');
        if (fullScreen) {
            fullScreen.onclick = () => this.fullScreen();
        }
        const closeFullScreen = document.getElementById('closefullscreen');
        if (closeFullScreen) {
            closeFullScreen.onclick = () => this.closeFullScreen();
        }
        const changeSpriteAction = document.getElementById('changeSpriteAction');
        if (changeSpriteAction) {
            changeSpriteAction.onclick = () => this.changeSpriteAction();
        }
        const removeSprite = document.getElementById('removeSprite');
        if (removeSprite) {
            removeSprite.onclick = () => this.removeSprite();
        }
        const addSprite = document.getElementById('addSprite');
        if (addSprite) {
            addSprite.onclick = () => this.addSprite();
        }
        const flipSprite = document.getElementById('flipSprite');
        if (flipSprite) {
            flipSprite.onclick = () => this.flipSprite();
        }

        this.addGossos();
        this.animate();
    }
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(105, 1, 0.1, 1000);
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 50;
        this.camera.lookAt(this.scene.position);

    }
    addLightsToScene() {
        const light = new THREE.DirectionalLight(0xffffff, 1.0);
        light.position.set(100, 100, 100);
        this.scene.add(light);
        const light2 = new THREE.DirectionalLight(0xffffff, 1.0);
        light2.position.set(-100, 100, -100);
        this.scene.add(light2)
    }

    addGossos() {
        const spriteAnimated = new SpriteAnimated();
        const movingImage = spriteAnimated.loadImage('./assets/w1.png', 1, 1, 9, 8, 100, 9, this.renderer.capabilities.getMaxAnisotropy());
        spriteAnimated.setScale(10, 10, 1);
        spriteAnimated.setTranslation(-50, -10, 0);
        spriteAnimated.setNumRow(6);
        movingImage.name = 'Gos 1';
        spriteAnimated.id = 0;
        this.scene.add(movingImage);
        this.animatedEntities.push(spriteAnimated);

        const thirdSprite = new SpriteAnimated();
        const thirdMovingImage = thirdSprite.loadImage('./assets/w1.gif', 1, 1, 9, 8, 100, 9, this.renderer.capabilities.getMaxAnisotropy());
        thirdSprite.flipSpriteY();
        thirdSprite.flipSpriteRads(1);
        thirdSprite.setNumRow(2);
        thirdSprite.setScale(10, 10, 1);
        thirdSprite.setTranslation(50, -10, 0);
        thirdMovingImage.name = 'Gos 2';
        spriteAnimated.id = 1;
        this.scene.add(thirdMovingImage);
        this.animatedEntities.push(thirdSprite);
    }


    animate(): void {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }

    render(): void {
        if (this.constantMoveLeftCamera) {
            this.camera.position.x = Math.max(this.camera.position.x - 1, this.maxCoordCameraLeft);
        }
        if (this.constantMoveRightCamera) {
            this.camera.position.x = Math.min(this.camera.position.x + 1, this.maxCoordCameraRight);
        }
        if (this.constantMoveUpCamera) {
            this.camera.position.y = Math.min(this.camera.position.y + 1, this.maxCoordCameraUp);
        }
        if (this.constantMoveDownCamera) {
            this.camera.position.y = Math.max(this.camera.position.y - 1, this.maxCoordCameraDown);
        }
        for (const entity of this.animatedEntities) {
            if (entity.isMoving) {
                if (entity.sprite && entity.destiny) {
                    let newPosX = entity.sprite.position.x - entity.destiny.x;
                    let newPosY = entity.sprite.position.y - entity.destiny.y;
                    if (newPosY < 0) {
                        entity.sprite.position.y += Math.max(Math.min(1, Math.abs(newPosY) / Math.max(0.00001, Math.abs(newPosX))), newPosY);
                    }
                    else {
                        entity.sprite.position.y -= Math.min(Math.min(1, Math.abs(newPosY) / Math.max(0.00001, Math.abs(newPosX))), newPosY);

                    }
                    if (newPosX < 0) {
                        entity.sprite.position.x += Math.max(Math.min(1, Math.abs(newPosX) / Math.max(0.00001, Math.abs(newPosY))), newPosX);
                    }
                    else {
                        entity.sprite.position.x -= Math.min(Math.min(1, Math.abs(newPosX) / Math.max(0.00001, Math.abs(newPosY))), newPosX);
                    }
                    if (newPosX === 0 && newPosY === 0) {
                        entity.stopMoving();
                    }
                    this.updateTxt();
                }
            }
        }
        this.renderer.render(this.scene, this.camera);
    }

    moveCamToLeft() {
        this.moveCam(-1, 0, 0);
    }

    moveCamToRight() {
        this.moveCam(1, 0, 0);
    }

    moveCamToUp() {
        this.moveCam(0, 1, 0);
    }

    moveCamToDown() {
        this.moveCam(0, -1, 0);
    }

    moveCamToCloser() {
        this.moveCam(0, 0, -1);
    }

    moveCamToFarther() {
        this.moveCam(0, 0, 1);
    }
    moveSprite1px(x: number, y: number) {
        const sprite = this.animatedEntities[this.selectedImage].sprite;
        if (sprite) {
            sprite.position.x += x;
            sprite.position.y += y;
        }
    }

    moveCam(tweakX: number, tweakY: number, tweakZ: number) {
        this.camera.position.x += tweakX;
        this.camera.position.y += tweakY;
        this.camera.position.z += tweakZ;
    }

    keyListen(e: KeyboardEvent) {
        if (e.keyCode === 38) {
            if (this.selectedImage === -1) {
                this.moveCamToUp();
            }
            else {
                this.moveSprite1px(0, 1);
            }
        }
        else if (e.keyCode === 40) {
            if (this.selectedImage === -1) {
                this.moveCamToDown();
            }
            else {
                this.moveSprite1px(0, -1);
            }
        }
        else if (e.keyCode === 37) {
            if (this.selectedImage === -1) {
                this.moveCamToLeft();
            }
            else {
                this.moveSprite1px(-1, 0);
            }
        }
        else if (e.keyCode === 39) {
            if (this.selectedImage === -1) {
                this.moveCamToRight();
            }
            else {
                this.moveSprite1px(1, 0);
            }
        }
        else if (e.keyCode === 107) {
            this.moveCamToCloser();
        }
        else if (e.keyCode === 109) {
            this.moveCamToFarther();
        }
    }

    mouseMoveCameraListen(e: MouseEvent) {
        if (e.x < 1) {
            this.constantMoveLeftCamera = true;
        }
        else {
            this.constantMoveLeftCamera = false;
        }
        if (e.y < 1) {
            this.constantMoveUpCamera = true;
        }
        else {
            this.constantMoveUpCamera = false;
        }
        // eslint-disable-next-line no-restricted-globals
        if (e.x > screen.width - 10) {
            this.constantMoveRightCamera = true;
        }
        else {
            this.constantMoveRightCamera = false;
        }
        if (e.y > window.innerHeight - 10) {
            this.constantMoveDownCamera = true;
        }
        else {
            this.constantMoveDownCamera = false;
        }
    }

    mouseCachePoistionCameraListen(e: MouseEvent) {
        if (e.x < 1) {
            this.constantMoveLeftCamera = true;
        }
        else {
            this.constantMoveLeftCamera = false;
        }
        if (e.y < 1) {
            this.constantMoveUpCamera = true;
        }
        else {
            this.constantMoveUpCamera = false;
        }
        // eslint-disable-next-line no-restricted-globals
        if (e.x > screen.width - 10) {
            this.constantMoveRightCamera = true;
        }
        else {
            this.constantMoveRightCamera = false;
        }
        if (e.y > window.innerHeight - 10) {
            this.constantMoveDownCamera = true;
        }
        else {
            this.constantMoveDownCamera = false;
        }
    }

    centerCamera() {
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 50;
    }

    fullScreen() {
        // eslint-disable-next-line no-restricted-globals
        this.renderer.setSize(screen.width, screen.height - 4);
        document.documentElement.requestFullscreen();
    }

    closeFullScreen() {
        document.exitFullscreen();
        setTimeout(() => { this.renderer.setSize(window.innerWidth, window.innerHeight - 4) }, 100);

    }

    scrollDirection(e: WheelEvent) {
        if (e.deltaY < 0 && this.camera.position.z > 1) {
            this.moveCamToCloser();
        }
        else if (e.deltaY > 0 && this.camera.position.z < 200) {
            this.moveCamToFarther();
        }
    }

    moveSprite(event: MouseEvent) {
        // console.log('movesprite');
        let vec = new THREE.Vector3(); // create once and reuse
        let pos = new THREE.Vector3(); // create once and reuse
        vec.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            - (event.clientY / window.innerHeight) * 2 + 1,
            0);
        vec.unproject(this.camera);
        vec.sub(this.camera.position).normalize();
        var distance = - this.camera.position.z / vec.z;
        pos.copy(this.camera.position).add(vec.multiplyScalar(distance));
        const sprite = this.animatedEntities[this.selectedImage].sprite
        if (sprite) {
            sprite.translateX(pos.x);
            sprite.translateY(pos.y);
            sprite.position.x = pos.x;
            sprite.position.y = pos.y;
        }
        // this.emitter.next({ action: 'moveUnit', details: `${this.animatedEntities[this.selectedImage].id}\n${pos.x}\n${pos.y}` });
    }

    spriteWalk(event: MouseEvent) {
        console.log('spritewalk');
        let vec = new THREE.Vector3(); // create once and reuse
        let pos = new THREE.Vector3(); // create once and reuse
        vec.set(
            (event.clientX / window.innerWidth) * 2 - 1,
            - (event.clientY / window.innerHeight) * 2 + 1,
            0);
        vec.unproject(this.camera);
        vec.sub(this.camera.position).normalize();
        var distance = - this.camera.position.z / vec.z;
        pos.copy(this.camera.position).add(vec.multiplyScalar(distance));
        if (this.animatedEntities[this.selectedImage]) {
            this.animatedEntities[this.selectedImage].startMoving(pos);
            this.emitter.next({ action: 'moveUnit', details: `${this.animatedEntities[this.selectedImage].id}\n${Math.round(pos.x)}\n${Math.round(pos.y)}` });
        }
    }

    spriteWalkFromNet(id: number, x: number, y: number) {
        console.log('spritewalk');
        let vec = new THREE.Vector3(); // create once and reuse
        let pos = new THREE.Vector3(); // create once and reuse
        vec.set(
            (x / window.innerWidth) * 2 - 1,
            - (y / window.innerHeight) * 2 + 1,
            0);
        vec.unproject(this.camera);
        vec.sub(this.camera.position).normalize();
        var distance = - this.camera.position.z / vec.z;
        pos.copy(this.camera.position).add(vec.multiplyScalar(distance));
        const entity = this.animatedEntities.find(animatedEntity => animatedEntity.id === id);
        if (entity) {
            entity.startMoving(pos);
        }
    }

    readClick(event: MouseEvent) {
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        const spriteArray = this.animatedEntities.map(spriteAnimated => spriteAnimated.sprite);
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);
        let intersects = raycaster.intersectObjects(spriteArray as Object3D[]);

        if (event.button === 2) {
            this.spriteWalk(event);
        }
        else if (event.button === 0) {
            if (intersects.length > 0) {
                this.selectedImage = spriteArray.indexOf(intersects[0].object as Sprite);
                this.updateTxt();
            }
            else if (intersects.length == 0) {
                this.selectedImage = -1;
                this.updateTxt();
            }
        }
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    changeSpriteAction() {
        this.animatedEntities[this.selectedImage].setNumRow(this.animatedEntities[this.selectedImage].getNumRow() + 1);
        this.updateTxt();
        return false;
    }

    removeSprite() {
        const sprite = this.animatedEntities[this.selectedImage].sprite;
        if (sprite) {
            this.scene.remove(sprite);
        }
        this.animatedEntities.splice(this.selectedImage, 1);
        if (this.selectedImage >= this.animatedEntities.length) {
            this.selectedImage = this.animatedEntities.length - 1;
        }
        this.updateTxt();
    }
    addSprite() {
        const spriteAnimated = new SpriteAnimated();
        const movingImage = spriteAnimated.loadImage('../assets/w1.png', 1, 1, 9, 8, 100, 9, this.renderer.capabilities.getMaxAnisotropy());
        spriteAnimated.setScale(10, 10, 1);
        spriteAnimated.setTranslation(-50, -10, 0);
        spriteAnimated.setNumRow(6);
        spriteAnimated.flipSpriteY();
        spriteAnimated.flipSpriteRads(1);
        movingImage.name = "Gos " + this.imageNumber;
        this.scene.add(movingImage);
        this.animatedEntities.push(spriteAnimated);
        this.selectedImage += 1;
        this.imageNumber += 1;
        this.updateTxt();
    }

    flipSprite() {
        this.animatedEntities[this.selectedImage].flipSpriteRads((this.animatedEntities[this.selectedImage].getInitialFrame() + 1) % 2);
        this.animatedEntities[this.selectedImage].flipSpriteY();
    }


    updateTxt() {
        if (this.selectedImage === -1) {
            (<HTMLButtonElement>document.getElementById('selectedSprite')).value = 'nada';
            (<HTMLButtonElement>document.getElementById('selectedAnimation')).value = 'x';
            (<HTMLButtonElement>document.getElementById('spritePos')).value = 'nada';
        }
        else {
            const sprite = this.animatedEntities[this.selectedImage].sprite;
            if (sprite) {
                (<HTMLButtonElement>document.getElementById('selectedSprite')).value = sprite.name;
                (<HTMLButtonElement>document.getElementById('selectedAnimation')).value = '' + this.animatedEntities[this.selectedImage].getNumRow();
                (<HTMLButtonElement>document.getElementById('spritePos')).value = sprite.position.x + ' | ' + sprite.position.y;
            }
        }

    }
}
