import * as THREE from 'three';
window.THREE = THREE;
const createGeometry = require('three-bmfont-text');
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';
import BaseSketch from './base-sketch';
import font from './fonts/NotoSans-Regular.json';
import fontMSDF from './fonts/NotoSans-Regular.png';
import * as dat from 'dat.gui';

export default class Sketch extends BaseSketch {
  constructor(selector) {
    super({ selector, width: 512, height: 512 });

    // const axesHelper = new THREE.AxesHelper(500);
    // this.scene.add(axesHelper);

    this.datGui();
    this.addObjects();
  }

  datGui() {
    this.gui = new dat.GUI();
    this.settings = {
      amplitude: { x: 0, y: 10, z: 10 },
      frequency: { x: 0, y: 0.7, z: 0.7 },
      text: 'Hello',
    };
    this.gui.add(this.settings.amplitude, 'x', 0, 200, 0.5).name('amplitude X');
    this.gui.add(this.settings.amplitude, 'y', 0, 200, 0.5).name('amplitude Y');
    this.gui.add(this.settings.amplitude, 'y', 0, 200, 0.5).name('amplitude Z');
    this.gui.add(this.settings.frequency, 'x', 0, 1, 0.05).name('frequency X');
    this.gui.add(this.settings.frequency, 'y', 0, 1, 0.05).name('frequency Y');
    this.gui.add(this.settings.frequency, 'z', 0, 1, 0.05).name('frequency Z');
    this.gui.add(this.settings, 'text').onFinishChange((value) => {
      this.geometry.update({ text: value });
      this.mesh.position.y = -this.geometry.layout.height / 2;
      this.mesh.position.x = -this.geometry.layout.width / 2;
    });
  }

  addObjects() {
    this.geometry = createGeometry({
      align: 'center',
      font: font,
      text: this.settings.text,
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(fontMSDF, (glyphs) => {
      this.glyphs = glyphs;
      const { amplitude: a, frequency: fr } = this.settings;
      this.material = new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
          u_time: new THREE.Uniform(0),
          u_amplitude: new THREE.Uniform(new THREE.Vector3(a.x, a.y, a.z)),
          u_frequency: new THREE.Uniform(new THREE.Vector3(fr.x, fr.y, fr.z)),
          map: new THREE.Uniform(glyphs),
          color: new THREE.Uniform(new THREE.Color(0x000000)),
        },
      });

      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.y = -this.geometry.layout.height / 2;
      this.mesh.position.x = -this.geometry.layout.width / 2;
      this.mesh.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI);
      this.scene.add(this.mesh);

      this.animate();
    });
  }

  animate() {
    this.time += 0.05;

    this.material.uniforms.u_time.value = this.time;
    this.material.uniforms.u_amplitude.value.x = this.settings.amplitude.x;
    this.material.uniforms.u_amplitude.value.y = this.settings.amplitude.y;
    this.material.uniforms.u_amplitude.value.z = this.settings.amplitude.z;
    this.material.uniforms.u_frequency.value.x = this.settings.frequency.x;
    this.material.uniforms.u_frequency.value.y = this.settings.frequency.y;
    this.material.uniforms.u_frequency.value.z = this.settings.frequency.z;

    this.render();
    this.rafId = requestAnimationFrame(this.animate.bind(this));
  }
}

new Sketch('container');
