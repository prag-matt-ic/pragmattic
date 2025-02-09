uniform float uTime;
uniform float uEnterProgress;

varying float vEdgeCloseness;
varying float vSeed;

const vec3 COLOUR = vec3(0.9, 0.9, 0.9);

// A fast pseudo-random function:
float random(float x) {
  return fract(sin(x) * 43758.5453123);
}

void main() {
  // Creating the soft circle
  // gl_PointCoord is a vec2 containing coordinates of the fragment within the point being rendered
  vec2 normalizedPoint = gl_PointCoord - vec2(0.5);
  // Calculate the distance from the center of the point
  float dist = length(normalizedPoint);
  // Smooth the distance to get a soft circle
  float circle = 1.0 - smoothstep(0.1, 0.5, dist);

  // ------------------------------------------
  // Compute a randomized fade cycle for this point.
  // ------------------------------------------
  
  // Use the seed (vSeed) to generate an offset so that not all points
  // start their fade cycles at the same time.
  float offset = random(vSeed);
  // Determine a cycle period. Here we mix a period between 0.2 and 1.0 seconds
  // based on a slightly offset seed.
  float period = mix(0.8, 2.0, random(vSeed + 1.0));
  
  // Compute where we are in the fade cycle. Adding the offset * period randomizes
  // the starting time.
  float tCycle = mod(uTime + offset * period, period);
  
  // Define fade durations relative to the period.
  // For example, let the fade-in take 30% of the period and fade-out the last 30%.
  float fadeInDuration  = period * 0.4;
  float fadeOutDuration = period * 0.4;
  
  // Compute a smooth fade-in from 0 to 1. Max alpha is 0.7.
  float fadeIn = smoothstep(0.0, fadeInDuration, tCycle) * 0.7;
  // Compute a smooth fade-out from 1 to 0.
  float fadeOut = 1.0 - smoothstep(period - fadeOutDuration, period, tCycle);
  // The flicker (fade) alpha is the product of the fade in and fade out parts.
  float flickerAlpha = fadeIn * fadeOut;

  // Fade out towards the edges of the tunnel
  float alpha = circle * vEdgeCloseness * flickerAlpha * uEnterProgress;

  gl_FragColor = vec4(COLOUR, alpha);
}



