import { PerspectiveCamera } from "three";

export default class Camera extends PerspectiveCamera {
  constructor() {
    super(75, window.innerWidth / window.innerHeight, 1, 1000);
    this.position.y += 20;
    this.rotation.set(0, 0, 0);
  }
}
