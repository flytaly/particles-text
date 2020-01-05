precision highp float;

attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float time;
uniform float pixelRatio;
uniform sampler2D texture1;
uniform vec2 dimensions;

varying vec4 vColor;

void main() {
    // move to the center
    vec3 p = position - vec3(0.5 * dimensions, 0.);
    // normalize coords
    vec2 uvSource = position.xy / dimensions;
    // send to the fragment shader
    vColor = texture2D(texture1, uvSource);

    p /= dimensions.x;

    p.z = 0.03*cos(position.x*0.03 + time*0.1);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
    gl_PointSize = pixelRatio / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
}

