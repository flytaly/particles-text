precision highp float;

varying vec4 vColor;

uniform float time;
uniform vec2 dimensions;

void main() {
    vec2 uv = gl_FragCoord.xy/dimensions;
    vec4 color = vec4(vColor);

    gl_FragColor = color;
}
