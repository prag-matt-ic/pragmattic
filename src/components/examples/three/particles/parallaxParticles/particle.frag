uniform float uTime;

varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {
  vec3 color = vec3(0.2353, 0.9843, 0.7333);

  // gl_PointCoord is a vec2 containing the coordinates of the fragment within the point being rendered
  vec2 normalizedPoint = gl_PointCoord - vec2(0.5);
  // Calculate the distance from the center of the point
  float dist = length(normalizedPoint);

  float circle = 1.0 - step(0.5, dist);
  float innerCircle = step(0.35, dist);


  float zOpacity = clamp(0.0, 1.0, vPosition.z * 0.5 + 0.5);

  float opacity = circle * innerCircle * zOpacity;

  gl_FragColor = vec4(color, opacity);
}



