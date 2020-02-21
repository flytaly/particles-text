import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);

export default class BaseSketch {
  constructor({ width = window.innerWidth, height = window.innerWidth, selector, withOrbitControls = true }) {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.width = width;
    this.height = height;
    this.renderer.setSize(this.width, this.height);

    this.container = document.getElementById(selector);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.001, 1000);
    this.camera.position.set(0, 0, 1);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    if (withOrbitControls) {
      new OrbitControls(this.camera, this.renderer.domElement);
    }

    this.time = 0;
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.gui) {
      this.gui.destroy();
    }

    this.renderer.dispose();
    this.scene.dispose();

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
