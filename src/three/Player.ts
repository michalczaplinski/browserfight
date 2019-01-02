import { Object3D, Vector3 } from "three";
import { BFObject, BFDocument } from "../types";
import Camera from "./Camera";
import uuid from 'uuid';

export default class Player implements BFObject {

  id = uuid.v4();
  pitchObject: Object3D;
  yawObject: Object3D;
  PI_2: number;
  velocity: Vector3;
  movementX: number = 0;
  movementY: number = 0;
  moveForward: boolean = false;
  moveBackward: boolean = false;
  moveLeft: boolean = false;
  moveRight: boolean = false;
  prevTime: any;

  constructor(camera: Camera) {
    this.pitchObject = new Object3D();
    this.pitchObject.add(camera);

    this.yawObject = new Object3D();
    this.yawObject.position.y = 30;
    this.yawObject.add(this.pitchObject);

    this.PI_2 = Math.PI / 2;
    this.velocity = new Vector3();

    this.prevTime = performance.now();

    document.addEventListener('keydown', this.onKeyDown, false);
    document.addEventListener('keyup', this.onKeyUp, false);
    document.addEventListener('mousemove', this.onMouseMove, false);
  }

  get() {
    return this.yawObject;
  }

  updateMouse = () => {
    const bfdocument: BFDocument = document
    if (!bfdocument.pointerLockElement) {
      return
    }
    this.yawObject.rotation.y -= this.movementX * 0.002;
    this.pitchObject.rotation.x -= this.movementY * 0.002;
    this.pitchObject.rotation.x = Math.max(
      -this.PI_2,
      Math.min(this.PI_2, this.pitchObject.rotation.x)
    );
  }

  updateKeyboard = () => {
    var time = performance.now();
    var delta = (time - this.prevTime) / 1000;

    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;

    if (this.moveForward) {
      this.velocity.z -= 400.0 * delta;
    }
    if (this.moveBackward) {
      this.velocity.z += 400.0 * delta;
    }

    if (this.moveLeft) {
      this.velocity.x -= 400.0 * delta;
    }
    if (this.moveRight) {
      this.velocity.x += 400.0 * delta;
    }

    this.get().translateX(this.velocity.x * delta);
    this.get().translateY(this.velocity.y * delta);
    this.get().translateZ(this.velocity.z * delta);

    this.prevTime = time;
  }

  update() {
    this.updateMouse();
    this.updateKeyboard();
  }

  private onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        this.moveForward = true;
        break;
      case 37: // left
      case 65: // a
        this.moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        this.moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        this.moveRight = true;
        break;
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        this.moveForward = false;
        break;
      case 37: // left
      case 65: // a
        this.moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        this.moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        this.moveRight = false;
        break;
    }
  };

  private onMouseMove = (event: MouseEvent) => {
    this.movementX = event.movementX || 0;
    this.movementY = event.movementY || 0;
  };
}
