import { Scene, WebGLRenderer, Fog } from 'three';

import Camera from './Camera';
import Player from './Player';
import Floor from './Floor';
import Light from './Light';
import Bullet from './Bullet';

import { BFObject } from '../types';
import ClientStore from '../stores/ClientStore';

class Application {

    objects: BFObject[];
    scene: Scene;

    constructor() {
        this.objects = [];
        this.scene = new Scene();
        this.scene.fog = new Fog(0xffffff, 0, 2000);
    }

    //TODO: we could probably optimize by not adding the objects twice...
    add(obj: BFObject) {
        this.objects.push(obj);
        if (typeof obj.get === 'function') {
            this.scene.add(obj.get());
        }
    }
}

class ClientApplication extends Application {

    renderer: WebGLRenderer;
    store: ClientStore;
    camera: Camera;
    player: Player;
    floor: Floor;
    light: Light;

    constructor(node: HTMLDivElement | null, store: ClientStore) {
        super();

        this.store = store;

        window.addEventListener('resize', () => this.handleResize(), false);

        this.renderer = new WebGLRenderer();
        this.renderer.setClearColor(0xffffff);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.camera = new Camera();
        this.player = new Player(this.camera)
        this.floor = new Floor();
        this.light = new Light();
        const app = this

        app.add(this.player);
        app.add(this.floor);
        app.add(this.light);

        const shootBullet = () => {
            app.add(new Bullet(this.player, this.camera));
            //TODO: destroy the bullet object after a few secs 
            // in order to garbage collect
        }

        window.addEventListener('click', shootBullet, false);

        if (node) {
            node.appendChild(this.renderer.domElement);
            this.run();
        }
    }

    handleResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    run = () => {
        requestAnimationFrame(() => {
            this.run();
        });
        this.update();
        this.renderer.render(this.scene, this.camera);
    }

    update = () => {
        this.objects.forEach(object => {
            if (typeof object.update === 'function') {
                object.update();
            }
        });
        const { x, y, z } = this.player.get().position;
        this.store.updateState({ x, y, z })
    }
}


export { Application, ClientApplication }