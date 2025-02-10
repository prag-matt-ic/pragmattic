uniform float uTime; 

uniform float uPositionsProgress; // Value between 0 and 1
uniform sampler2D uPositions0;
uniform sampler2D uPositions1;
uniform sampler2D uPointerTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {

  vec3 pos0 = texture2D(uPositions0, vUv).xyz;
  vec3 pos1 = texture2D(uPositions1, vUv).xyz;


  // Adjust the position progress based on the Y value
  // float adjustedProgress = pow(uPositionsProgress, 1.0 - vViewPosition.y);

  vec3 pos = mix(pos0, pos1, uPositionsProgress);

  // Output the new position
  gl_FragColor = vec4(pos, 0.0);
}