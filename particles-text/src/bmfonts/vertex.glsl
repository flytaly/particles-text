uniform float u_time;
uniform vec3 u_amplitude;
uniform vec3 u_frequency;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 newPos = position;
  newPos = newPos.xyz + sin(newPos.yxx * u_frequency + u_time) * u_amplitude;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.);
}


