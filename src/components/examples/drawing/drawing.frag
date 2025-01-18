// Drawing app fragment shader
#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uAspect;
uniform bool uIsPointerDown;
uniform vec2 uPointers[24];
uniform sampler2D uPrevTexture; 

uniform float uBrushSize;
uniform vec3 uBrushColour;
uniform float uBrushDistortion;

const float FEATHER = 0.005;

varying vec2 vUv;

// Distance from a point p to the line segment a->b
float lineSegmentDist(in vec2 p, in vec2 a, in vec2 b) {
  vec2 ab = b - a;
  float bet = dot(p - a, ab) / dot(ab, ab);
  bet = clamp(bet, 0.0, 1.0);
  vec2 closestPoint = a + bet * ab;
  return distance(p, closestPoint);
}

void main() {
  // Read previous pass color from the texture
  vec4 prevColour = texture2D(uPrevTexture, vUv);
  // If pointer is not down, just keep the previous color
  if (!uIsPointerDown) {
    gl_FragColor = prevColour;
    return;
  }

  vec2 uv = vUv;
  uv.x *= uAspect;

  float coverage = 0.0;

  float n1 = noise(vec3(uv.x, uv.y, uTime)) * 0.5 * uBrushDistortion;
  float n2 = noise(vec3(uv.y, uv.x, uTime * 0.5)) * 0.5 * uBrushDistortion;

  // Loop through pointers and draw a circle for each one.
  for (int i = 0; i < 24; i ++) {
    vec2 pointer = (uPointers[i] + vec2(1.0)) * 0.5; // Convert pointer from [-1, 1] to [0, 1]
    pointer.x *= uAspect; // Adjust for aspect ratio

    // Distort pointer if needed
    if (uBrushDistortion > 0.0) {
      pointer.x += n1;
      pointer.y -= n2;
    }

    // Draw 40 sister lines around the pointer


    float dist = distance(uv, pointer);
    float circle = 1.0 - smoothstep(uBrushSize, uBrushSize + FEATHER, dist);
    coverage = max(coverage, circle);
  }

  // Mix brush color with previous color based on how close we are to the segment
  vec3 newColour = mix(prevColour.rgb, uBrushColour, coverage);

  // Write final color
  gl_FragColor = vec4(newColour, 1.0);
}


 
// const vec3 TOP_COLOUR = vec3(0.1, 0.4, 0.5);
// const vec3 BOTTOM_COLOUR = vec3(0.2, 0.8, 1.0);

 // Function to get the color of a circle based on its index
// float getCircle(vec2 uv, vec2 pointer, float yOffset, float radius) {
//   float feather = 0.001; // Feathering around circle edge
//   float dist = distance(uv, vec2(pointer.x, pointer.y + yOffset));
//   float circle = smoothstep(radius, radius + feather, dist);
//   return circle;
// }

   // Noise
  // float timeSin = sin(uTime);
  // float timeCos = cos(uTime);
  // float n = noise(vec3(uv.x, uv.y * timeSin, timeCos));

  // Get circles
  // float mainBrush = getCircle(uv, adjustedPointer, 0.0, 0.002);
  // float topBrushYOffset = 0.03 * (1.0 - n) / 3.0;
  // float topBrush = getCircle(uv, adjustedPointer, topBrushYOffset, 0.002);
  // float bottomBrushYOffset = -0.05 * n;
  // float bottomBrush = getCircle(uv, adjustedPointer, bottomBrushYOffset, 0.002);

  // // Blend each circle over the previous frame color
  // vec3 mix1 = mix(prevColour.rgb, BOTTOM_COLOUR, 1.0 - bottomBrush);
  // vec3 mix2 = mix(mix1, TOP_COLOUR, 1.0 - topBrush);
  // vec3 mix3 = mix(mix2, MAIN_COLOUR, 1.0 - mainBrush);
  // vec4 finalColour = vec4(mix3, 1.0);
