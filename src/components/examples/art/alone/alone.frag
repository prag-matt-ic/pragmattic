// gradient.frag

uniform float uTime;
uniform float uScrollProgress;
uniform float uAspectRatio;

varying vec2 vUv;

const vec2 circleCenter = vec2(0.0);
const vec4 orange = vec4(0.8784, 0.4039, 0.0157, 1.0);
const vec4 red = vec4(0.5529, 0.1216, 0.0353, 1.0);


  vec4 mixCircleWithGlow (in float radius, in vec4 circleColour, in float distanceToCenter, inout vec4 colour) {
    float circle = step(radius, distanceToCenter);

    // float glow = smoothstep(radius, radius * 1.1, distanceToCenter);
    // vec4 glowColour = vec4(circleColour.r + 0.1, circleColour.g + 0.1, circleColour.b + 0.1, 0.5);
    
    // colour = mix(glowColour, colour, glow);

    colour = mix(circleColour, colour, circle);
    return colour;
  }


void main() {
  vec2 uv = vUv;
  uv = uv * 2.0 - 1.0; // Normalize UV coordinates to range [-1, 1]
  uv.x *= uAspectRatio; // Adjust for aspect ratio

  float distanceToCenter = distance(uv, circleCenter);

  // Calculate the current phase of the animation
  float t = mod(uScrollProgress * 2.0, 4.0);

  // Set background color based on the phase
  vec4 backgroundColour = t <= 2.0 ? orange : red;
  vec4 colour = backgroundColour;

  // Calculate Circle A radius
  float redCircleRadius = t; // t <= 2.0 ? t : 0.0;
  // Calculate Circle B radius
  float orangeCircleRadius = t - 2.0;


  colour = mixCircleWithGlow(redCircleRadius, red, distanceToCenter, colour);
  colour = mixCircleWithGlow(orangeCircleRadius, orange, distanceToCenter, colour);
  
  // float redCircle = step(redCircleRadius, distanceToCenter);
  // float orangeCircle = step(orangeCircleRadius, distanceToCenter);

  // Mix colors based on circle visibility
  // colour = mix(red, colour, redCircle);
  // colour = mix(orange, colour, orangeCircle);

  gl_FragColor = colour;
}




