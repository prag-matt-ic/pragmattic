// Loop points vertex shader
attribute float seed;

uniform sampler2D uPositions;
uniform float uTime;

varying float vSeed;

const float MIN_PT_SIZE = 4.0;
const float LG_PT_SIZE = 24.0;
const float XL_PT_SIZE = 72.0;

void main() {
  // Sample the final, displaced position from the simulation texture.
  vec3 pos = texture2D(uPositions, uv).xyz;
  
  // Transform the position into world space.
  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  
  // Transform to view and clip space.
  vec4 viewPosition = viewMatrix * worldPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  // Compute point size based on seed and depth
  float stepSeed = step(0.98, seed); // 5% of the points will be XL size
  float baseSize = mix(mix(MIN_PT_SIZE, LG_PT_SIZE, seed), XL_PT_SIZE, stepSeed); // random seed for point size

  float attenuationFactor = 1.0 / -viewPosition.z; // particles get smaller as they move away from the camera
  float pointSize = baseSize * attenuationFactor;

  vSeed = seed;
  
  gl_PointSize = pointSize;
  gl_Position = projectedPosition;
}
