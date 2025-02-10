varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {


  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  // Assign the varying variables
  vUv = uv;
  vPosition = position;
  vViewPosition = viewPosition.xyz;

  gl_Position = projectedPosition;
}
