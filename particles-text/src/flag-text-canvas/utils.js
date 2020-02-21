import * as THREE from 'three';

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
