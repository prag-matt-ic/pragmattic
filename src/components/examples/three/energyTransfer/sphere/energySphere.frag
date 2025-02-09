  // Energy Sphere Fragment Shader

  #pragma glslify: noise = require('glsl-noise/simplex/3d')

  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uColour;
  uniform bool uIsOnLeft;

  varying vec2 vUv;

  void main() {
    float timeInfluence = uIsOnLeft ? -uTime : uTime;

    float uvX = fract(vUv.x * 4.0 + timeInfluence * 0.3);

    // X value is flipped for mirrored noise effect (preventing sharp lines)
    float n = noise(vec3(abs(uvX - 0.5), vUv.y * 2.0, -uTime * 1.2)) * 0.5 + 0.5;

    // Distance to the top - the end which is pointing towards the tunnel
    float distanceToTop = distance(vUv.y, 1.0 - n * 0.1);

    float noiseIntensity = mix(0.1, 1.0, 1.0 - distanceToTop * 2.0);
    float colourN = n * noiseIntensity;

    vec3 color = mix(uColour, vec3(1.0), colourN);

    // Mask the top of the sphere by adding white colour in a soft circle around Y = 0
    float softCircle = 1.0 - smoothstep(0.02, 0.28, distanceToTop);
    color = mix(color, vec3(1.0), softCircle);

    gl_FragColor = vec4(color, 1.0);
  }
