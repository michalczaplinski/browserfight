import { Scene, WebGLRenderer, Fog } from 'three';

import Camera from './Camera';
import { DataFromClient, BFObject } from '../types';

class Application {

    objects: BFObject[];
    scene: Scene;
    camera: Camera;

    constructor(camera: Camera) {
        this.objects = [];
        this.scene = new Scene();
        this.scene.fog = new Fog(0xffffff, 0, 2000);
        this.camera = camera;
    }

    //TODO we could probably optimize by not adding the objects twice...
    add(obj: BFObject) {
        this.objects.push(obj);
        if (typeof obj.get === 'function') {
            this.scene.add(obj.get());
        }
    }
}

class ClientApplication extends Application {

    renderer: WebGLRenderer;

    //TODO: Pass the DOM node where we initialize the App
    constructor(camera: Camera, node: HTMLDivElement | null) {
        super(camera);
        // TODO: put the renderer into its own class and handleResize there
        window.addEventListener('resize', () => this.handleResize(), false);
        this.renderer = new WebGLRenderer();
        this.renderer.setClearColor(0xffffff);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (node) {
            node.appendChild(this.renderer.domElement);
            this.run();
        }
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    run() {
        requestAnimationFrame(() => {
            this.run();
        });
        // this.update();
        this.renderer.render(this.scene, this.camera);
    }

    update(newPositions: DataFromClient) {
        this.objects.forEach(object => {
            if (typeof object.updatePosition === 'function') {
                object.updatePosition(newPositions);
            }
        });
    }
}


// TODO: add this still
// function shootBullet() {
//     app.add(new Bullet(player, camera));
// }

// window.addEventListener('click', shootBullet, false);


export { Application, ClientApplication }