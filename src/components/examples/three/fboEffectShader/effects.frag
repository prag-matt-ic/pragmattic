// Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')
#pragma glslify: blur = require('glsl-fast-gaussian-blur/13')

// Uniforms received from the JavaScript
uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uSceneTexture;

// Varyings received from the vertex shader
varying vec2 vUv;

void main() {
  vec4 sceneColour = texture2D(uSceneTexture, vUv);

  // create a blurred noisy version of the scene
  vec2 blurredSceneUv = vUv;
  float noiseValue = noise(vec3(vUv * 1.2, uTime * 0.5)) * 0.05;
  blurredSceneUv += noiseValue;
  vec4 blurredScene = blur(uSceneTexture, blurredSceneUv, uResolution, vec2(1.0, 4.0));
  
  // create a vignette
  vec2 center = vec2(0.5, 0.5);
  float vignette = distance(center, vUv);
  vignette = smoothstep(0.3, 0.5, vignette);
  vec4 vignetteColour = vec4(0.0667, 0.0667, 0.0667, 1.0);

  vec4 finalColour = mix(sceneColour, blurredScene, vignette);
  finalColour = mix(finalColour, vignetteColour, vignette);

  // create noise grain
  float noiseGrain = noise(vec3(vUv * 320., uTime * 10.0)) * 0.5 + 0.5;
  vec4 noiseGrainColour = vec4(vec3(noiseGrain), 1.0);

  finalColour = mix(finalColour, noiseGrainColour, 0.1);

  gl_FragColor = finalColour;
}