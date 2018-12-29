import { WebGLRenderer } from "three";
import Camera from './Camera';

export class ResizeListener {
    renderer: WebGLRenderer;
    camera: Camera;

    constructor(camera: Camera, renderer: WebGLRenderer) {
        this.camera = camera;
        this.renderer = renderer;
        window.addEventListener('resize', () => this.handleResize(), false);
    }

    handleResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}