// Home Background Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uAspect;
uniform vec3 uLightColour;
uniform vec3 uMidColour;
uniform vec3 uOffBlackColour;
uniform vec3 uBlackColour;

varying vec2 vUv;

void main() {        
  // Normalized noise values with different uv scales
  float noiseA = noise(vec3(vUv * 2., uTime * 0.2)) * 0.5 + 0.5;
  float noiseB = noise(vec3(vUv * 4., uTime * 0.1)) * 0.5 + 0.5;

  // mix 3 colours based on noise values
  vec3 colour = mix(mix(uMidColour, uOffBlackColour, noiseB), uBlackColour, noiseA);

  // vignette
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uAspect;
  float vignette = distance(uv, vec2(0.0));
  float vig = smoothstep(0.6, 1.2, vignette);
  colour = mix(colour, uBlackColour, vig);

  // high frequency noise for a grainy effect
  float noiseV = noise(vec3(vUv * 400.0, uTime)); 
  vec3 noiseColour = mix(colour, uMidColour, noiseV);

  colour = mix(colour, noiseColour, 0.2);

  gl_FragColor = vec4(colour, 1.0);
}