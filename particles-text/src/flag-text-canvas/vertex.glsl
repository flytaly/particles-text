precision highp float;

attribute vec2 endPos;

// attribute vec3 position;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;

uniform float time;
uniform float pixelRatio;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 dimensions;

varying vec4 vColor;
uniform vec2 mouse;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float circle(vec2 uv, vec2 p, float r, float blur){
    float dist = length(uv - p);
    return smoothstep(r, r - blur, dist);
}


void main() {
    vec3 startP = position;
    vec3 endP = vec3(endPos, 0.);

    vec3 p = mix(startP, endP, progress);
    vec3 d = endP - startP;
    float r = length(d);
    p.z = 0.3*r*sin(3.1415926*progress);

    // move to the center
     p = p - vec3(0.5 * dimensions, 0.);

    // normalize coords
    vec2 uvFrom = position.xy / dimensions;
    vec2 uvTo = endPos / dimensions;

    // send to the fragment shader
    // vColor = texture2D(texture1, uvSource);
    vColor = mix(texture2D(texture1, uvFrom), texture2D(texture2, uvTo), progress);

    p /= dimensions.x;
    // waves
    p.z += 0.02*cos(mix(startP, endP, progress).x*.02 + time*0.05);
    // holes
    p.z += 0.01*cos(mix(endP, startP, progress).x*.02 + time*0.03);
    p.z -= circle(p.xy*0.9, mouse, 0.1, 0.1)*0.1;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
    gl_PointSize = pixelRatio / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
}

