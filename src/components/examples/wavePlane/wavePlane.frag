// Wave Plane Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uScrollOffset;

// Config
uniform vec3 uColourPalette[4];

// Grid
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

float brightenValue(in float colour) {
  return clamp(colour + 0.25, 0.0, 1.0);
}

void main() {
  vec2 uv = vUv; 

  // Colour the surface
  vec3 colour = cosineGradientColor(vTerrainHeight, uColourPalette[0], uColourPalette[1], uColourPalette[2], uColourPalette[3]);
  vec4 finalColor = vec4(colour, 1.0);

  if (uShowGrid) {
    // Draw thin horizontal lines
    float lineThickness = 0.001 * uGridSize;
    float yOffset = uScrollOffset * 6.0; // Move the lines by adding the scroll offset
    float linePosY = fract(uv.y * uGridSize + yOffset);
    float lineAlphaY = 1.0 - step(lineThickness, linePosY);
    // Draw thin vertical lines
    float linePosX = fract(uv.x * uGridSize);
    float lineAlphaX = 1.0 - step(lineThickness, linePosX);

    float lineAlpha = max(lineAlphaY, lineAlphaX);

    vec4 lineColor = vec4(brightenValue(colour.r), brightenValue(colour.g), brightenValue(colour.b), lineAlpha);
    finalColor = mix(finalColor, lineColor, lineAlpha);
  }

  // Fade out towards the edges
  float distanceToCenter = distance(vUv, vec2(0.5));
  float fogAmount = smoothstep(0.35, 0.5, distanceToCenter);

  finalColor = mix(finalColor, BG_COLOUR, fogAmount);

  gl_FragColor = finalColor;
}