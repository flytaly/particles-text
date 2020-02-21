import * as THREE from 'three';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';
import BaseSketch from '../lib/base-sketch';
import gsap from 'gsap';
import { generateGeometry, generate2DPositions } from './utils';
import TextTexture from './canvas-render-text';

export default class Sketch extends BaseSketch {
  constructor(selector) {
    super({ selector, width: 512, height: 256 }, true);

    this.text1 = 'THREE.js';
    this.text2 = 'Node';
    this.canvas1 = document.createElement('canvas');
    this.canvas2 = this.canvas1.cloneNode();
    document.body.append(this.canvas1, this.canvas2);
    this.elements = [this.canvas1, this.canvas2];

    this.mouse();
    this.transitionOnClick();
    this.addDomElements();
    this.addObjects();
    this.animate();
    // this.scene.add(new THREE.AxesHelper());
    this.generateTextTexture();
  }
  stop() {
    this.elements.forEach((e) => document.body.removeChild(e));
    this.texture1.dispose();
    this.texture2.dispose();
    this.geometry.dispose();
    this.material.dispose();
    this.scene.remove(this.points);
    super.stop();
  }

  generateTextTexture() {
    new TextTexture({ canvas: this.canvas1, text: this.text1, width: this.width, height: this.height, size: 100 });
    new TextTexture({ canvas: this.canvas2, text: this.text2, width: this.width, height: this.height, size: 100 });
    this.texture1 = new THREE.CanvasTexture(this.canvas1);
    this.texture2 = new THREE.CanvasTexture(this.canvas2);
    this.material.uniforms.texture1.value = this.texture1;
    this.material.uniforms.texture2.value = this.texture2;
  }

  addDomElements() {
    const header = document.createElement('h1');
    header.textContent = 'Draw text in canvas and import into THREE.js';
    const btn = document.createElement('button');
    btn.innerText = 'generate';

    const input1 = document.createElement('input');
    input1.setAttribute('type', 'text');
    const input2 = input1.cloneNode();

    this.elements.push(header, input1, input2, btn);

    document.body.prepend(header, input1, input2, btn);
    input1.value = this.text1;
    input2.value = this.text2;

    btn.addEventListener('click', () => {
      this.text1 = input1.value;
      this.text2 = input2.value;
      this.generateTextTexture();
    });
  }

  addObjects() {
    this.geometry = generateGeometry(this.width, this.height).geometry;
    const endPositions = generate2DPositions(this.width, this.height);
    this.geometry.setAttribute('endPos', new THREE.BufferAttribute(endPositions, 2));
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { type: 'f', value: 0 },
        texture1: { type: 't', value: this.texture1 },
        texture2: { type: 't', value: this.texture2 },
        pixelRatio: { type: 'f', value: window.devicePixelRatio },
        dimensions: { type: 'v2', value: new THREE.Vector2(this.width, this.height) },
        ratio: { type: 'f', value: this.width / this.height },
        progress: { type: 'f', value: 0 },
        mouse: { type: 'v2', value: new THREE.Vector2(-1, -1) },
      },
      vertexShader,
      fragmentShader,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.rotation.y = 0.5;
    this.scene.add(this.points);
  }

  mouse() {
    this.currentX = 0;
    this.currentY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseOut = 1;
    const w = this.width;
    const h = this.height;
    this.container.addEventListener('mousemove', (event) => {
      this.isMouseOut = 0;
      this.mouseX = (event.offsetX - w / 2) / (w / 2);
      this.mouseX = this.mouseX * 0.1;
      this.mouseY = (event.offsetY - h / 2) / (h / 2);
      this.mouseY = this.mouseY * 0.1;
    });

    this.container.addEventListener('mouseleave', (event) => {
      this.mouseX = 0;
      this.mouseY = 0;
      this.isMouseOut = 1;
    });
  }

  transitionOnClick() {
    let f = true;
    document.body.addEventListener('click', () => {
      const tl = gsap.timeline();
      if (f) {
        tl.to(this.material.uniforms.progress, {
          duration: 1,
          value: 1,
          onComplete: () => (f = !f),
        });
      } else {
        tl.to(this.material.uniforms.progress, {
          duration: 1,
          value: 0,
          onComplete: () => (f = !f),
        });
      }
    });
  }

  animate() {
    this.time++;

    let distanceX = this.currentX + this.mouseX;
    let distanceY = this.currentY - this.mouseY;
    this.currentX -= distanceX * 0.03;
    this.currentY -= distanceY * 0.03;

    this.points.rotation.y = 0.5 - this.currentX * 2;
    this.points.rotation.x = this.currentY * 2;

    this.points.position.x = this.currentX * 0.5;
    this.points.position.y = this.currentY * 0.3;

    this.material.uniforms.time.value = this.time;
    this.material.uniforms.mouse.value.x = this.isMouseOut + this.mouseX * 5 * (this.width / this.height);
    this.material.uniforms.mouse.value.y = this.isMouseOut + -this.mouseY * 5;
    this.render();
    this.rafId = requestAnimationFrame(this.animate.bind(this));
  }
}
