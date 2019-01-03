import { Scene, WebGLRenderer, Fog, Mesh, CubeGeometry, MeshPhongMaterial, Raycaster, Intersection, Object3D } from 'three';

import Camera from './Camera';
import Player from './Player';
import Floor from './Floor';
import Light from './Light';
import Bullet from './Bullet';

import { BFObject, BFElement, BFDocument } from '../types';
import ClientStore from '../stores/ClientStore';
import ServerStore from '../stores/ServerStore';
import { ResizeListener } from './ResizeListener';
import Crosshair from './Crosshair';
import addPointerLock from '../utils/pointerLock';
import { reaction } from 'mobx';

export default class Application {

  renderer: WebGLRenderer = new WebGLRenderer();
  objects: BFObject[] = [];
  scene: Scene = new Scene();
  store: ClientStore | ServerStore;
  camera: Camera = new Camera();
  player: Player = new Player(this.camera);
  players: { [key: string]: Mesh } = {}
  floor: Floor = new Floor();
  light: Light = new Light();
  raycaster: Raycaster = new Raycaster();
  crosshair: Crosshair = new Crosshair();
  intersects: Intersection[] = [];

  constructor(node: BFElement, store: ClientStore | ServerStore) {
    this.store = store;

    this.renderer.setClearColor(0xffffff);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene.fog = new Fog(0xffffff, 0, 2000);

    this.add(this.player);
    this.add(this.floor);
    this.add(this.light);

    new ResizeListener(this.camera, this.renderer)

    const shootBullet = () => {
      const bfdocument: BFDocument = document
      if (!bfdocument.pointerLockElement) {
        return
      }
      const bullet = new Bullet(this.player, this.camera)
      this.add(bullet);

      this.intersects.forEach(player => {
        const id = player.object.uuid;

      });

      setTimeout(() => {
        this.objects = this.objects.filter(obj => obj.id !== bullet.id);
        this.scene.remove(bullet.get());
      }, 2000)
    }

    reaction(
      () => this.store.newPlayer,
      () => {
        this.createNewPlayer(this.store.newPlayer)
      })

    window.addEventListener('click', shootBullet, false);
    addPointerLock();

    if (node) {
      node.appendChild(this.renderer.domElement);
      this.run();
    }
  }

  add = (obj: BFObject) => {
    this.objects.push(obj);
    if (typeof obj.get === 'function') {
      this.scene.add(obj.get());
    }
  }

  run = () => {
    requestAnimationFrame(this.run);
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
    this.store.updatePosition({ x, y, z })

    this.raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);
    this.intersects = this.raycaster.intersectObjects(Object.values(this.players));
    for (var i = 0; i < this.intersects.length; i++) {
      console.log(this.intersects[i])
    }

    Object.keys(this.players).forEach(playerId => {
      if (this.store.gameState[playerId]) {
        this.players[playerId].position.setX(this.store.gameState[playerId].x)
        this.players[playerId].position.setY(this.store.gameState[playerId].y)
        this.players[playerId].position.setZ(this.store.gameState[playerId].z)
      }
    })
  }

  createNewPlayer = (id: string) => {
    const avatar = new Mesh(
      new CubeGeometry(20, 20, 20),
      new MeshPhongMaterial(
        {
          color: `rgb(
            ${Math.ceil(Math.random() * 155 + 100)}, 
            ${Math.ceil(Math.random() * 155 + 100)}, 
            ${Math.ceil(Math.random() * 155 + 100)}
          )`
        }));
    avatar.position.y = 0;
    avatar.position.z = -10;
    avatar.uuid = id;

    this.players[id] = avatar;
    this.scene.add(avatar);
  }
}
