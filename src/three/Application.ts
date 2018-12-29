import { Scene, WebGLRenderer, Fog } from 'three';

import Camera from './Camera';
import Player from './Player';
import Floor from './Floor';
import Light from './Light';
import Bullet from './Bullet';

import { BFObject, BFElement } from '../types';
import ClientStore from '../stores/ClientStore';
import ServerStore from '../stores/ServerStore';
import { ResizeListener } from './ResizeListener';
import addPointerLock from '../utils/pointerLock';

export default class Application {

    renderer: WebGLRenderer;
    objects: BFObject[];
    scene: Scene;
    store: ClientStore | ServerStore;
    camera: Camera;
    player: Player;
    floor: Floor;
    light: Light;

    constructor(node: BFElement, store: ClientStore | ServerStore) {
        this.store = store;

        this.renderer = new WebGLRenderer();
        this.renderer.setClearColor(0xffffff);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.objects = [];
        this.scene = new Scene();
        this.scene.fog = new Fog(0xffffff, 0, 2000);
        this.camera = new Camera();
        this.player = new Player(this.camera)
        this.floor = new Floor();
        this.light = new Light();

        this.add(this.player);
        this.add(this.floor);
        this.add(this.light);

        new ResizeListener(this.camera, this.renderer)

        const shootBullet = () => {
            this.add(new Bullet(this.player, this.camera));
            //TODO: destroy the bullet object after a few secs 
            // in order to garbage collect
        }

        window.addEventListener('click', shootBullet, false);

        addPointerLock(node)
        node.appendChild(this.renderer.domElement);
        this.run();

    }

    add(obj: BFObject) {
        this.objects.push(obj);
        if (typeof obj.get === 'function') {
            this.scene.add(obj.get());
        }
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
