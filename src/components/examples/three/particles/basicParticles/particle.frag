uniform float uTime;

varying vec3 vPosition;

void main() {
  // Colour the particles
  float sinTime = sin(uTime) * 0.5 + 0.5;
  vec3 color = vec3(sinTime, 0.3, vPosition.x);

  // gl_PointCoord is a vec2 containing the coordinates of the fragment within the point being rendered
  vec2 normalizedPoint = gl_PointCoord - vec2(0.5);
  // Calculate the distance from the center of the point
  float dist = length(normalizedPoint);
  float circle = 1.0 - step(0.5, dist);

  float opacity = circle;
  opacity *= 0.5;

  gl_FragColor = vec4(color, opacity);
}



