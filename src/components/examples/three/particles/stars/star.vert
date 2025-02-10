#pragma glslify: rotation3dZ = require(glsl-rotate/rotation-3d-z)

uniform float uTime;
uniform float uScrollProgress;

varying vec3 vViewPosition;

const float MIN_POINT_SIZE = 0.5;
const float MAX_POINT_SIZE = 64.0;

void main() {
  vec3 particlePosition = position;

  // Move the particle forward based on the scroll progress
  particlePosition.z -= uScrollProgress * 3.0;
  // Rotate the particle based on its z position and the scroll progress to create spiral effect
  float timeRotation = uTime * 0.03;
  particlePosition *= rotation3dZ(-position.z * (uScrollProgress * 0.5) - timeRotation);
  
  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  // Assign the varying values
  vViewPosition = viewPosition.xyz;

  // Attenuation factor - further away the particle is from the camera, the smaller it will be
  float attenuationFactor = (1.0 / projectedPosition.z);

  // Point size is required for point rendering
  float pointSize = clamp(MIN_POINT_SIZE, MAX_POINT_SIZE, MAX_POINT_SIZE * attenuationFactor);
  
  gl_PointSize = pointSize;
  gl_Position = projectedPosition;
}