import { BoxGeometry, MeshBasicMaterial, Mesh, PerspectiveCamera, Vector3 } from "three";
import Player from "./Player";
import Camera from "./Camera";

export default class Bullet {

  geometry: BoxGeometry;
  material: MeshBasicMaterial;
  mesh: Mesh;
  direction: Vector3 = new Vector3();
  position: Vector3 = new Vector3();

  // TODO: i need to decouple the constructor from the controls
  constructor(player: Player, camera: Camera) {
    // TODO: remember that the bullet orientation needs to be set as well
    this.geometry = new BoxGeometry(3, 3, 3);
    this.material = new MeshBasicMaterial({ color: 'red' });
    this.mesh = new Mesh(this.geometry, this.material);

    this.mesh.position.setX(player.get().position.x);
    // 7 is an arbitrary offset here
    this.mesh.position.setY(player.get().position.y - 5);
    this.mesh.position.setZ(player.get().position.z);
    this.direction = camera.getWorldDirection(this.direction);
    this.mesh.translateOnAxis(this.direction, -200);
  }

  update() {
    this.mesh.translateOnAxis(this.direction, 100);
  }

  // TODO: add the mesh getter setter to an Abstract Base Class
  get() {
    return this.mesh;
  }
}
