// Blog background fragment shader
#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform vec3 uLightColour;
uniform vec3 uMidColour;
uniform vec3 uDarkColour;

varying vec2 vUv;

void main() {
  float n = noise(vec3(vUv.x * 1.2, vUv.y * 1.2, uTime * 0.16));
  vec3 colour = mix(uMidColour, uDarkColour, n);

  float nf = noise(vec3(vUv * 400.0, uTime * 0.4)); 
  vec3 noiseColour = mix(colour, uMidColour, nf);

  colour = mix(colour, noiseColour, 0.25);
  gl_FragColor = vec4(colour, 1.0);
}