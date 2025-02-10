uniform sampler2D uPositions;
uniform float uTime;
uniform vec3 uPointerWorld; // Pointer position in world space
uniform mat4 uInverseModelMatrix; // Inverse of the model matrix

varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {
  // Sample the particle position from the render target (object space)
  vec3 pos = texture2D(uPositions, position.xy).xyz;

  // Transform the pointer position to object space
  vec4 pointerObjectSpace = uInverseModelMatrix * vec4(uPointerWorld, 1.0);
  vec3 pointerOS = pointerObjectSpace.xyz;

  // Calculate the vector from the particle to the pointer in object space
  vec3 toPointer = pointerOS - pos;

  // Calculate the distance and direction
  float distance = length(toPointer);
  vec3 direction = normalize(toPointer);

  // Define the radius of influence and attraction strength
  float radius = 2.0; // Adjust as needed
  float attractionStrength = smoothstep(radius, 0.0, distance);

  // Apply the attraction force
  pos += direction * attractionStrength * 0.2; // Adjust the factor as needed

  // Transform the updated position to clip space
  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  // Continue as before
  float attenuationFactor = (1.0 / -viewPosition.z);
  vPosition = pos;
  vViewPosition = viewPosition.xyz;

  gl_Position = projectedPosition;
  gl_PointSize = 96.0 * attenuationFactor;
  gl_PointSize = clamp(gl_PointSize, 2.0, 64.0);
}
