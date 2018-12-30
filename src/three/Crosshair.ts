import { Mesh, RingBufferGeometry, MeshBasicMaterial } from "three";

class Crosshair {

  crosshair: Mesh;

  constructor() {
    this.crosshair = new Mesh(
      new RingBufferGeometry(0.02, 0.04, 32),
      new MeshBasicMaterial({
        color: 0x000000,
        opacity: 0.5,
        transparent: true
      })
    );

    this.crosshair.position.z = -1;

  }

  get() {
    return this.crosshair;
  }
}

export default Crosshair;