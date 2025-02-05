#pragma glslify: noise = require('glsl-noise/simplex/2d')

uniform float uTime; 
uniform sampler2D uInitialPositions;
uniform sampler2D uPositions1;
uniform sampler2D uPositions2;
uniform float uTransitionInProgress; // Value between 0 and 1
uniform float uBlendProgress;        // Value between 0 and 1

// New uniforms for pointer displacement & noise.
uniform vec3 uPointerPosition;       // In world space (or simulation space)
uniform float uNoiseMultiplier;      // Smoothed [0,1] value from CPU

const float POINTER_RADIUS = 0.7;
const float POINTER_STRENGTH = 0.7;
const float BASE_NOISE_SCALE = 0.2;

varying vec2 vUv;

void main() {
  // Mix the basic positions.
  vec3 initialPos = texture2D(uInitialPositions, vUv).xyz;
  vec3 pos1 = texture2D(uPositions1, vUv).xyz;
  vec3 pos2 = texture2D(uPositions2, vUv).xyz;
  
  // Compute a blended position based on your transition parameters.
  vec3 pos = mix(initialPos, mix(pos1, pos2, uBlendProgress), uTransitionInProgress);

  // --- Pointer displacement and noise ---
  // Compute the distance between the current particle and the pointer.
  float d = length(pos - uPointerPosition);
  // Create an influence factor: 1.0 at the pointer and 0.0 at the radius.
  float influence = smoothstep(POINTER_RADIUS, 0.0, d);

  // Compute a noise value for each axis. (We use different offsets to get independent channels.)
  vec3 noiseVec = vec3(
    noise(pos.xy + vec2(0.0, uTime * 0.6)),
    noise(pos.yz + vec2(17.0, uTime * 0.4)),
    noise(pos.xz + vec2(91.0, uTime * 0.6))
  );

  // Apply noise offset (scaled by a base scale, influence and a CPU-supplied multiplier).
  pos -= noiseVec * BASE_NOISE_SCALE * influence * uNoiseMultiplier;
  // Displace the position toward the pointer.
  pos -= (uPointerPosition - pos) * influence * POINTER_STRENGTH;
  
  // Output the final simulated position.
  gl_FragColor = vec4(pos, 1.0);
}
