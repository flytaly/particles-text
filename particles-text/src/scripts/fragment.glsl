precision highp float;

varying vec4 vColor;

uniform float time;
uniform vec2 dimensions;

void main() {
    vec2 uv = gl_FragCoord.xy/dimensions;
    vec4 color = vec4(vColor);
    vec3 bgColor = vec3(1., .6, .4);
    vec3 fontColor = vec3(0., 0., 0.);

    color.rgb = bgColor*(1. - color.a) + fontColor*color.a;
    color.a = 1.;
    gl_FragColor = color;
}
