uniform sampler2D uPositions;
uniform float uTime;

const float MAX_POINT_SIZE = 72.0;

void main() {
  // Sample the final, displaced position from the simulation texture.
  vec3 pos = texture2D(uPositions, uv).xyz;
  
  // Transform the position into world space.
  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  
  // Transform to view and clip space.
  vec4 viewPosition = viewMatrix * worldPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  // Compute point size based on depth.
  float attenuationFactor = 1.0 / -viewPosition.z;
  float pointSize = clamp(MAX_POINT_SIZE * attenuationFactor, 6.0, MAX_POINT_SIZE);
  
  gl_PointSize = pointSize;
  gl_Position = projectedPosition;
}
