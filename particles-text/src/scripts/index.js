import * as THREE from 'three';
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
    ratio: { type: 'f', value: w / h },
    progress: { type: 'f', value: 0 },
    mouse: { type: 'v2', value: new THREE.Vector2(-1, -1) },
  },
  vertexShader,
  fragmentShader,
});

let points = new THREE.Points(geometry, material);
// points.rotateOnAxis(new THREE.Vector3(0, 0.5, 0), 0.5);

points.rotation.y = 0.5;

scene.add(points);

let time = 0;
let currentX = 0,
  currentY = 0,
  mouseX = 0,
  mouseY = 0,
  isMouseOut = 1;
function animate() {
  time++;

  let distanceX = currentX + mouseX;
  let distanceY = currentY - mouseY;
  currentX -= distanceX * 0.03;
  currentY -= distanceY * 0.03;

  points.rotation.y = 0.5 - currentX * 2;
  points.rotation.x = currentY * 2;

  points.position.x = currentX * 0.5;
  points.position.y = currentY * 0.3;

  material.uniforms.time.value = time;
  material.uniforms.mouse.value.x = isMouseOut + mouseX * 5 * (w / h);
  material.uniforms.mouse.value.y = isMouseOut + -mouseY * 5;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function mouse(container, w, h) {
  container.addEventListener('mousemove', function(event) {
    isMouseOut = 0;
    mouseX = (event.offsetX - w / 2) / (w / 2);
    mouseX = mouseX * 0.1;
    mouseY = (event.offsetY - h / 2) / (h / 2);
    mouseY = mouseY * 0.1;
  });

  container.addEventListener('mouseleave', function(event) {
    mouseX = 0;
    mouseY = 0;
    isMouseOut = 1;
  });
}

mouse(renderer.domElement, w, h);

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
