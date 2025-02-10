varying vec3 vPosition;
// varying vec3 vViewPosition;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  vPosition = position;

  // Attenuation factor - the further away the particle is from the camera, the smaller it will be
  float attenuationFactor = (1.0 / projectedPosition.z);
  float pointSize = 64.0 * attenuationFactor;
  // Point size is required for point rendering
  gl_PointSize = pointSize;
}