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
    terrains: THREE.Mesh[] = [];
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
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.axis = new THREE.AxesHelper(10);
    }

    initScene() {
        console.log('scene inited');
        document.onmouseout = this.mouseCachePoistionCameraListen.bind(this);
        document.onmousemove = this.mouseMoveCameraListen.bind(this);
        document.onkeydown = this.keyListen.bind(this);
        document.onwheel = this.scrollDirection.bind(this);
        this.elem = document.documentElement;
        this.scene = new THREE.Scene();
        this.initCamera();
        console.log('position: ', this.scene.position);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x111111)
        this.renderer.setSize(window.innerWidth, window.innerHeight - 4);
        document.body.appendChild(this.renderer.domElement);
        this.addLightsToScene();
        console.log('canvas: ', document.getElementsByTagName('canvas'));
        document.getElementsByTagName('canvas')[0].oncontextmenu = (event) => this.readClick(event);
        document.getElementsByTagName('canvas')[0].onclick = (event) => this.readClick(event);


        this.addGossos();
        this.animate();
        this.geometriks();
    }

    deleteScene() {
        document.body.removeChild(this.renderer.domElement);
        this.removeAllSprites();
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.x = 0;
        this.camera.position.y = -15;
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

    geometriks(): void {
        const geometry = new THREE.BufferGeometry();
        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle. 
        const vertexPositions = [
            [-66.0, -66.0, -1.0],
            [66.0, -66.0, -1.0],
            [66.0, 66.0, -1.0],

            [66.0, 66.0, -1.0],
            [-66.0, 66.0, -1.0],
            [-66.0, -66.0, -1.0],

            [-66.0, -66.0, -7.0],
            [66.0, -66.0, -7.0],
            [66.0, 66.0, -7.0],

            [66.0, 66.0, -7.0],
            [-66.0, 66.0, -7.0],
            [-66.0, -66.0, -7.0],

            [-66.0, 66.0, -1.0],
            [66.0, 66.0, -7.0],
            [-66.0, 66.0, -7.0],

            [-66.0, 66.0, -1.0],
            [66.0, 66.0, -1.0],
            [66.0, 66.0, -7.0],

            [-66.0, -66.0, -1.0],
            [66.0, -66.0, -7.0],
            [-66.0, -66.0, -7.0],

            [-66.0, -66.0, -1.0],
            [66.0, -66.0, -1.0],
            [66.0, -66.0, -7.0],

            [-66.0, -66.0, -1.0],
            [-66.0, -66.0, -7.0],
            [-66.0, 66.0, -7.0],

            [-66.0, 66.0, -1.0],
            [-66.0, 66.0, -7.0],
            [-66.0, -66.0, -1.0],

            [66.0, -66.0, -1.0],
            [66.0, -66.0, -7.0],
            [66.0, 66.0, -7.0],

            [66.0, 66.0, -1.0],
            [66.0, 66.0, -7.0],
            [66.0, -66.0, -1.0]
        ];
        const vertices = new Float32Array(vertexPositions.length * 3); // three components per vertex

        // components of the position vector for each vertex are stored
        // contiguously in the buffer.
        for (let i = 0; i < vertexPositions.length; i++) {
            vertices[i * 3 + 0] = vertexPositions[i][0];
            vertices[i * 3 + 1] = vertexPositions[i][1];
            vertices[i * 3 + 2] = vertexPositions[i][2];
        }

        // itemSize = 3 because there are 3 values (components) per vertex
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.getAttribute('uv');
        const texture = new THREE.TextureLoader().load('./assets/w2.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 10,
            linecap: 'round', //ignored by WebGLRenderer
            linejoin: 'round' //ignored by WebGLRenderer
        });
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
        const mesh = new THREE.Mesh(geometry, material);
        this.terrains.push(mesh);
        // this.scene.add(mesh);
        this.scene.add(line);

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

    cameraLooktoLeft() {

        this.camera.rotateX(0.1);
    }

    cameraLooktoRight() {
        this.camera.rotateX(-0.1);


    }

    cameraLooktoUp() {
        this.camera.rotateY(0.1);
    }

    cameraLooktoDown() {
        this.camera.rotateY(-0.1);
    }

    cameraLookReset() {
        this.camera.lookAt(this.scene.position);
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
        let distance = - this.camera.position.z / vec.z;
        pos.copy(this.camera.position).add(vec.multiplyScalar(distance));
        if (this.animatedEntities[this.selectedImage]) {
            this.animatedEntities[this.selectedImage].startMoving(pos);
            this.emitter.next({ action: 'moveUnit', details: `${this.animatedEntities[this.selectedImage].id}\n${Math.round(pos.x)}\n${Math.round(pos.y)}` });
        }
    }

    spriteWalkFromNet(id: number, x: number, y: number) {
        console.log('spriteWalkFromNet');
        let vec = new THREE.Vector3(); // create once and reuse
        vec.set(
            x,
            y,
            0);
        const entity = this.animatedEntities.find(animatedEntity => animatedEntity.id === id);
        if (entity) {
            entity.startMoving(vec);
        }
    }

    readClick(event: MouseEvent) {
        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();
        const spriteArray = this.animatedEntities.map(spriteAnimated => spriteAnimated.sprite);
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);

        if (event.button === 2) {
            if (this.selectedImage !== -1) {
                console.log('selectedImage: ', this.selectedImage);
                console.log('animatedEntities: ', this.animatedEntities);
                const intersects = raycaster.intersectObjects(this.terrains);
                console.log('intersects: ', intersects);
                if (intersects.length) {
                    this.spriteWalkFromNet(this.animatedEntities[this.selectedImage].id, intersects[0].point.x, intersects[0].point.y)
                }
            }
            // this.spriteWalk(event);
        }
        else if (event.button === 0) {
            const intersects = raycaster.intersectObjects(spriteArray as Object3D[]);
            console.log('intersects: ', intersects);
            if (intersects.length > 0) {
                this.selectedImage = spriteArray.indexOf(intersects[0].object as Sprite);
                this.updateTxt();
            }
            else if (intersects.length == 0) {
                this.selectedImage = -1;
                this.updateTxt();
            }
            console.log('selectedImage: ', this.selectedImage);
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

    removeAllSprites() {
        while (this.animatedEntities.length) {
            if (this.animatedEntities[0].sprite) {
                this.scene.remove(this.animatedEntities[0].sprite)
            }
            this.animatedEntities.splice(0, 1);
        }
        for (let animatedEntity of this.animatedEntities) {

        }

    }
    addSprite() {
        const spriteAnimated = new SpriteAnimated();
        const movingImage = spriteAnimated.loadImage('./assets/w1.png', 1, 1, 9, 8, 100, 9, this.renderer.capabilities.getMaxAnisotropy());
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
        if (document.getElementById('selectedSprite')) {
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
}
