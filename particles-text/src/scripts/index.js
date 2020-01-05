import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);
import fragmentShader from './fragment.glsl';
import vertexShader from './vertex.glsl';
import { initThree, textToTexture, generateGeometry } from './utils';

const words = ['THREE', 'NODE', 'JS'];
const w = 512;
const h = 256;

const { scene, renderer, camera } = initThree(w, h);

const texture = textToTexture(words[0], { size: 124 }, { width: w, height: h, debug: true });

const geometry = generateGeometry(w, h);

const material = new THREE.RawShaderMaterial({
  uniforms: {
    time: { type: 'f', value: 0 },
    texture1: { type: 't', value: texture },
    pixelRatio: { type: 'f', value: window.devicePixelRatio },
    dimensions: { type: 'v2', value: new THREE.Vector2(w, h) },
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

animate();
