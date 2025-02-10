uniform float uTime;
uniform float uScrollProgress;

varying vec3 vViewPosition;

const vec3 COLOUR = vec3(0.6745, 0.6745, 0.5686);

void main() {
  // Creating the soft circle
  // gl_PointCoord is a vec2 containing coordinates of the fragment within the point being rendered
  vec2 normalizedPoint = gl_PointCoord - vec2(0.5);
  // Calculate the distance from the center of the point
  float dist = length(normalizedPoint);
  // Smooth the distance to get a soft circle
  float circle = 1.0 - smoothstep(0.05, 0.5, dist);
  
  // Fade out particles based on their distance from the camera
  float maxFadeDistance = 7.0; // Adjust as needed
  float distanceFade = smoothstep(maxFadeDistance, maxFadeDistance * 0.5, -vViewPosition.z);


  // Start to fade out particles after scroll progress reaches 85%
  float fadeOutOpacity = smoothstep(1.0, 0.85, uScrollProgress);

  float opacity = circle * distanceFade * fadeOutOpacity * 0.7;

  gl_FragColor = vec4(COLOUR, opacity);
}



