// Torus Vertex shader

// Import the noise function
#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;

varying vec2 vUv;

void main() {
    vUv = uv;

    // Mutate the position using noise
    vec3 projectedPosition = position;

    // Noise value between -1 and 1
    float noiseFactor = noise(vec3(projectedPosition.x * 0.25, projectedPosition.y * 0.4, projectedPosition.z * 0.5) + (uTime * 0.22));

    projectedPosition.z += noiseFactor * 0.12;

    // Set the position for the CustomShaderMaterial
    csm_Position = projectedPosition;
    
}
