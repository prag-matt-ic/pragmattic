// Wave Plane Vertex shader (wavePlane.vert)

// Import the noise function
#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uScrollProgress;

varying vec2 vUv;
varying float vTerrainHeight;


void main() {
    vec3 noiseInput = vec3(position.x / 4.0,( position.y / 4.0) + uScrollProgress, uTime * 0.2);
    float n = noise(noiseInput);
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


// Boilerplate Vertex Shader code: 
// varying vec2 vUv;

// void main() {
//     vec4 modelPosition = modelMatrix * vec4(position, 1.0);
//     vec4 viewPosition = viewMatrix * modelPosition;
//     vec4 projectedPosition = projectionMatrix * viewPosition;
//     vUv = uv;
//     gl_Position = projectedPosition;
// }
