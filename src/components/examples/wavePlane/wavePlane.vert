// Wave Plane Vertex shader

// Import the noise function
#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uScrollOffset;

varying vec2 vUv;
varying float vTerrainHeight;

void main() {
    float time = uTime * 0.2; // 1.0; // uTime 
    float n = noise(vec3(position.x / 4.0,( position.y / 4.0) + uScrollOffset, time));
    n = n * 0.5 + 0.5; // Noise value is between -1 and 1, normalise to 0-1
    
    vec3 newPosition = position;
    newPosition.z += n; // Add the noise value to the Z position to create the wave effect

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // Pass terrain height and UV to the fragment shader
    vTerrainHeight = n;
    vUv = uv;

    gl_Position = projectedPosition;
}