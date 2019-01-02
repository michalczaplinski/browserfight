import { PlaneGeometry, Color, Matrix4, MeshBasicMaterial, Mesh, VertexColors } from "three";
import uuid from 'uuid';
import { BFObject } from "../types";

export default class Floor implements BFObject {

  id: string = uuid.v4();
  geometry: PlaneGeometry;
  material: MeshBasicMaterial;
  mesh: Mesh;

  constructor() {
    this.geometry = new PlaneGeometry(2000, 2000, 100, 100);
    this.geometry.applyMatrix(new Matrix4().makeRotationX(-Math.PI / 2));
    this.material = new MeshBasicMaterial({
      vertexColors: VertexColors
    });
    this.mesh = new Mesh(this.geometry, this.material);
    this.createFloor();
  }

  createFloor() {
    for (let i = 0, l = this.geometry.vertices.length; i < l; i++) {
      var vertex = this.geometry.vertices[i];
      vertex.x += Math.random() * 20 - 10;
      vertex.y += Math.random() * 2;
      vertex.z += Math.random() * 20 - 10;
    }
    for (let i = 0, l = this.geometry.faces.length; i < l; i++) {
      let face = this.geometry.faces[i];
      face.vertexColors[0] = new Color().setHSL(
        Math.random() * 0.5 + 0.3,
        0.9,
        Math.random() * 0.15 + 0.75
      );
      face.vertexColors[1] = new Color().setHSL(
        Math.random() * 0.5 + 0.3,
        0.9,
        Math.random() * 0.15 + 0.75
      );
      face.vertexColors[2] = new Color().setHSL(
        Math.random() * 0.5 + 0.3,
        0.9,
        Math.random() * 0.15 + 0.75
      );
    }
  }

  get() {
    return this.mesh;
  }
}
