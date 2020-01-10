import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
import gsap from 'gsap';
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';
import { initThree, textToTexture, generateGeometry, generate2DPositions } from './utils';

const words = ['THREE', 'NODE', 'JS'];
const w = 512;
const h = 256;

const { scene, renderer, camera } = initThree(w, h);
scene.add(new THREE.AxesHelper());

const texture = textToTexture(words[0], { size: 100 }, { width: w, height: h, debug: true });
const texture2 = textToTexture(words[1], { size: 100 }, { width: w, height: h, debug: true });

const { geometry } = generateGeometry(w, h);
// shuffleArray(positions);
const endPositions = generate2DPositions(w, h);
geometry.setAttribute('endPos', new THREE.BufferAttribute(endPositions, 2));

const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { type: 'f', value: 0 },
    texture1: { type: 't', value: texture },
    texture2: { type: 't', value: texture2 },
    pixelRatio: { type: 'f', value: window.devicePixelRatio },
    dimensions: { type: 'v2', value: new THREE.Vector2(w, h) },
    progress: { type: 'f', value: 0 },
  },
  vertexShader,
  fragmentShader,
});

let points = new THREE.Points(geometry, material);

scene.add(points);

let time = 0;
function animate() {
  time++;
  material.uniforms.time.value = time;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

let f = true;
document.body.addEventListener('click', () => {
  const tl = gsap.timeline();
  if (f) {
    tl.to(material.uniforms.progress, {
      duration: 1,
      value: 1,
      onComplete: () => (f = !f),
    });
  } else {
    tl.to(material.uniforms.progress, {
      duration: 1,
      value: 0,
      onComplete: () => (f = !f),
    });
  }
});

animate();
