// Energy point vertex shader
// #pragma glslify: rotation3dX = require(glsl-rotate/rotation-3d-x)

attribute float seed;

uniform float uTime;
uniform float uHalfTunnelLength;

varying float vEdgeCloseness;
varying float vSeed;

const float MIN_PT_SIZE = 8.0;
const float MAX_PT_SIZE = 120.0;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  // Attenuation factor - further away the particle is from the camera, the smaller it will be
  float attenuationFactor = 1.0 / projectedPosition.z;

  // Use the seed attribute for the point size
  float baseSize = mix(0.0, MAX_PT_SIZE, seed);
  float edgeCloseness = smoothstep(-uHalfTunnelLength, -uHalfTunnelLength + 0.5, position.y) * smoothstep(uHalfTunnelLength, uHalfTunnelLength - 0.5, position.y);

  // Pass varyings to fragment shader
  vSeed = seed;  
  vEdgeCloseness = edgeCloseness;

  float pointSize = (baseSize * edgeCloseness + MIN_PT_SIZE) * attenuationFactor;
  
  gl_PointSize = pointSize;
  gl_Position = projectedPosition;
}