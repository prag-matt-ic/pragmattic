// Blog header fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform vec3 uLightColour;
uniform vec3 uMidColour;
uniform vec3 uDarkColour;

varying vec2 vUv;


void main() {
  float n = noise(vec3(vUv.x * 1.2, vUv.y, uTime * 0.16));
  vec3 colour = mix(uMidColour, uDarkColour, n);

  // high frequency noise for a grainy effect
  float noiseV = noise(vec3(vUv * 280.0, uTime)); 
  vec3 noiseColour = mix(colour, uLightColour, noiseV);

  colour = mix(colour, noiseColour, 0.2);
  
  gl_FragColor = vec4(colour, 1.0);
}