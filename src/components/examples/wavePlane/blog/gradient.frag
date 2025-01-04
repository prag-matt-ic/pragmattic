// Wave Plane Fragment shader
uniform float uTime;
uniform float uScrollOffset;
uniform vec3 uColourPalette[4];
uniform bool uShowGrid;
uniform float uGridSize;

// Received from the vertex shader
varying vec2 vUv; 
varying float vTerrainHeight; 

// Constants
const vec4 BG_COLOUR = vec4(0.0, 0.0, 0.0, 1.0);

// Colour palette values taken from: http://dev.thi.ng/gradients/
vec3 cosineGradientColor(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return clamp(a + b * cos(6.28318 * (c * t + d)), 0.0, 1.0);
}

void main() {
  // Colour the surface based on the height of the terrain
  vec3 colour = cosineGradientColor(vTerrainHeight, uColourPalette[0], uColourPalette[1], uColourPalette[2], uColourPalette[3]);
  vec4 finalColor = vec4(colour, 1.0);

  // Fade out towards the edges in a soft circular shape
  float distanceToCenter = distance(vUv, vec2(0.5));
  float fogAmount = smoothstep(0.35, 0.5, distanceToCenter);

  finalColor = mix(finalColor, BG_COLOUR, fogAmount);

  gl_FragColor = finalColor;
}
