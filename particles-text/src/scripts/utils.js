import * as THREE from 'three';
const OrbitControls = require('three-orbit-controls')(THREE);

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function shufflePairsArray(array) {
  for (let i = array.length / 2 - 1; i > 0; i--) {
    const pairIdx = i * 2;
    const j = Math.floor(Math.random() * i) * 2;

    [array[pairIdx], array[j]] = [array[j], array[pairIdx]];
    [array[pairIdx + 1], array[j + 1]] = [array[j + 1], array[pairIdx + 1]];
  }
}

export function generate2DPositions(w, h) {
  // let positions = new Float32Array(w * h * 2);
  // let temp = [];
  // for (let i = 0; i < w; i++) {
  //   for (let j = 0; j < h; j++) {
  //     temp.push([i, j]);
  //   }
  // }
  // shuffleArray(temp);
  // positions = new Float32Array(temp.flatMap((x) => x));

  let positions = new Float32Array(w * h * 2);
  let index = 0;
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      positions[index * 2] = i;
      positions[index * 2 + 1] = j;
      index++;
    }
  }
  shufflePairsArray(positions);
  return positions;
}

export const initThree = (w, h) => {
  const scene = new THREE.Scene();
  // scene.background = new THREE.Color('black');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setPixelRatio(window.devicePixelRatio);

  renderer.setSize(window.innerWidth, window.innerWidth);

  const container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(40, w / h, 0.001, 1000);
  // camera.position.set(-0.5, 0, 1);
  camera.position.set(0, 0, 1);

  new OrbitControls(camera, renderer.domElement);

  const setSizes = () => {
    const ww = w;
    const hh = h;
    renderer.setSize(ww, hh);
    camera.aspect = ww / hh;
    camera.updateProjectionMatrix();
  };

  setSizes();
  return { scene, renderer, camera };
};

export const generateGeometry = (w, h) => {
  let positions = new Float32Array(w * h * 3);
  let index = 0;
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      positions[index * 3] = i;
      positions[index * 3 + 1] = j;
      positions[index * 3 + 2] = 0;
      index++;
    }
  }
  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return { geometry, positions };
};

const defaultFontSettings = {
  size: 30,
  color: 'black',
  weight: 'bold',
  family: 'sans-serif',
};

const defaultCanvasSettings = {
  width: 255,
  height: 255,
  debug: false,
};

export const textToTexture = (text, fontSettings = defaultFontSettings, canvasSettings = defaultCanvasSettings) => {
  const { size, color, weight, family } = { ...defaultFontSettings, ...fontSettings };
  const { width, height, debug } = { ...defaultCanvasSettings, ...canvasSettings };

  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  if (debug) document.body.appendChild(canvas);
  canvas.width = width;
  canvas.height = height;

  // ctx.fillStyle = '#dddddd';
  // ctx.fillRect(0, 0, width, height);
  ctx.textAlign = 'center';
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.flipY = true;

  return texture;
};
