precision highp float;

varying vec4 vColor;

uniform float time;
uniform float ratio;
uniform vec2 dimensions;
uniform vec2 mouse;

float circle(vec2 uv, vec2 p, float r, float blur){
    float dist = length(uv - p);
    return smoothstep(r, r - blur, dist);
}

void main() {
    vec2 uv = gl_FragCoord.xy/dimensions-0.5;
    uv.x *= ratio;
    vec4 color = vec4(vColor);
    vec3 bgColor = vec3(1., .6, .4);
    vec3 fontColor = vec3(0., 0., 0.);

    color.rgb = bgColor*(1. - color.a) + fontColor*color.a;
    color.a = 1.;

    // color.rgb += circle(uv, mouse, 0.2, 0.07)*0.1;

    gl_FragColor = color;
}
