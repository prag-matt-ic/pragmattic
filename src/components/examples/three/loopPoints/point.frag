// Loop points fragment shader

uniform float uTime;
uniform float uScatteredAmount;
varying float vSeed;

const vec3 WHITE = vec3(1.0);
const vec3 ORANGE = vec3(1.0, 0.5, 0.0);

float random(float x) {
  return fract(sin(x) * 43758.5453123);
}

void main() {
  // gl_PointCoord is a vec2 containing the coordinates of the fragment within the point being rendered
  float circleAlpha = 1.0 - distance(gl_PointCoord, vec2(0.5));
  circleAlpha = pow(circleAlpha, 3.0);

  // FADE IN AND OUT CYCLE
  // Use the seed (vSeed) to generate an offset so that not all points start at the same time.
  float offset = random(vSeed);
  float period = mix(1.0, 3.0, random(vSeed));
  float tCycle = mod(uTime + offset * period, period);
  float fadeDuration = period * 0.3; // 30% of the period
  
  // Compute a smooth fade-in from 0 to 1. Max alpha is MAX_ALPHA.
  float fadeIn = smoothstep(0.0, fadeDuration, tCycle);
  // Compute a smooth fade-out from 1 to 0.
  float fadeOut = 1.0 - smoothstep(period - fadeDuration, period, tCycle);
  float flickerAlpha = fadeIn * fadeOut;

  float alpha = circleAlpha * flickerAlpha;

  // If the seed is greater than 0.98 make the colour cyan
  vec3 colour = mix(WHITE, ORANGE, step(0.98, vSeed));

  gl_FragColor = vec4(colour, alpha);
}



