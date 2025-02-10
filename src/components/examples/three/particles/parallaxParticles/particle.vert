uniform float uTime;

varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {

  vec3 particlePosition = position;
  
  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  // Assign the varying values
  vPosition = particlePosition;
  vViewPosition = viewPosition.xyz;

  // Attenuation factor - further away the particle is from the camera, the smaller it will be
  float attenuationFactor = (1.0 / projectedPosition.z);

  gl_Position = projectedPosition;
  // Point size is required for point rendering
  gl_PointSize = 96.0;
  gl_PointSize *= attenuationFactor;
}