// Environment fragment shader
#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
// Colours
uniform vec3 uDarkestColour;
uniform vec3 uCyanColour;
uniform vec3 uOrangeColour;
uniform vec3 uBlueColour;

uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vWorldPos;

// Color palette function
// http://dev.thi.ng/gradients/
vec3 cosineGradientColour(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return clamp(a + b * cos(6.28318 * (c * t + d)), 0.0, 1.0);
}


vec3 gradientColorRGB(float t) {
  // Wrap t to [0,1] (in case it goes out of bounds)
  t = mod(t, 1.0);
  vec3 color;

  // Break [0,1] into three equal segments:
  if (t < 1.0 / 3.0) {
    // First third: blue -> cyan
    float localT = t / (1.0 / 3.0);
    color = mix(uBlueColour, uCyanColour, localT);
  } else if (t < 2.0 / 3.0) {
    // Second third: cyan -> orange
    float localT = (t - 1.0 / 3.0) / (1.0 / 3.0);
    color = mix(uCyanColour, uOrangeColour, localT);
  } else {
    // Last third: orange -> blue
    float localT = (t - 2.0 / 3.0) / (1.0 / 3.0);
    color = mix(uOrangeColour, uBlueColour, localT);
  }

  return color;
}

float darkenValue(in float colour) {
   return clamp(colour - 0.02, 0.0, 1.0);
}

void main() {
  float nScale = 0.1;

  // base colour
  vec3 noiseIn = vec3((vWorldPos.x * nScale) - uTime * 0.2, (vWorldPos.y * nScale), nScale);
  float n = noise(noiseIn) * 0.5 + 0.5;

  // [[0.078 -0.912 0.518] [-1.176 -0.833 -0.154] [-0.263 0.389 -1.883] [-0.582 -0.292 -1.505]]
  // vec3 colour = cosineGradientColour(n, vec3(0.078, -0.912, 0.518), vec3(-1.176, -0.833, -0.154), vec3(-0.263, 0.389, -1.883), vec3(-0.582, -0.292, -1.505));

  vec3 colour = gradientColorRGB(n);

  vec2 textureUv = vUv;
  textureUv.y += n * 0.03;

  colour *= 0.1;

  // Add layered horizontal strips 
  for(float i = 1.; i < 4.; i++) {
    float strip = 1.0 - (smoothstep(0.0, i, abs(vWorldPos.y + sin(vWorldPos.x - uTime) * 0.4)));
    float cInput = sin(i + uTime * 0.5) * 0.5 + 0.5;
    vec3 stripColour = gradientColorRGB(cInput);
    strip *= 0.1;
    colour = mix(colour, stripColour, strip);
  }
  
  // Mix with texture colour
  vec4 textureColour = texture2D(uTexture, textureUv);
  vec3 textureColourGreyscale = vec3(dot(textureColour.rgb, vec3(0.299, 0.587, 0.114))) * 0.2;
  colour = mix(colour, textureColourGreyscale, 0.12);

  // Add vertical vignette
  float vFade = smoothstep(1.0, 4.3, abs(vWorldPos.y));
  colour = mix(colour, uDarkestColour, vFade);

  gl_FragColor = vec4(colour, 1.0);
}



