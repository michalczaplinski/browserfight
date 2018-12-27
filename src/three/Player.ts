import THREE, { Object3D, Vector3, Mesh, CubeGeometry, MeshPhongMaterial } from "three";
import { DataFromClient, BFObject } from "../types";
import Camera from "./Camera";

export default class Player implements BFObject {

  pitchObject: Object3D;
  yawObject: Object3D;
  PI_2: number;
  velocity: Vector3;
  movementX: number
  movementY: number
  moveForward: boolean
  moveBackward: boolean
  moveLeft: boolean
  moveRight: boolean
  prevTime: any;
  avatar: Mesh;

  constructor(camera: Camera) {
    this.pitchObject = new Object3D();
    this.pitchObject.add(camera);

    this.yawObject = new Object3D();
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);

    this.PI_2 = Math.PI / 2;
    this.velocity = new Vector3();

    this.movementX = 0;
    this.movementY = 0;
    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.prevTime = performance.now();

    // this is the visible player's mesh
    this.avatar = new Mesh(
      new CubeGeometry(20, 20, 20),
      new MeshPhongMaterial({ color: 0x222222 })
    );
    this.avatar.position.y = 10;
    this.avatar.position.z = 1;

    this.yawObject.add(this.avatar);
  }

  get() {
    return this.yawObject;
  }

  updateMouse() {
    this.yawObject.rotation.y -= this.movementX * 0.002;
    this.pitchObject.rotation.x -= this.movementY * 0.002;
    this.pitchObject.rotation.x = Math.max(
      -this.PI_2,
      Math.min(this.PI_2, this.pitchObject.rotation.x)
    );
  }

  updateKeyboard() {
    var time = performance.now();
    var delta = (time - this.prevTime) / 1000;

    console.log(this.moveForward);

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

  updatePosition(newPositions: DataFromClient) {
    this.get().position.setX(newPositions.x);
    this.get().position.setY(newPositions.y);
    this.get().position.setZ(newPositions.z);
  }
}
