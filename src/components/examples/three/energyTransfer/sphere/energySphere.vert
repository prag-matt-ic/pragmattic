// Energy Sphere Vertex Shader

#pragma glslify: noise = require('glsl-noise/simplex/2d')

uniform float uTime;
uniform float uSeed;
uniform bool uIsOnLeft;

varying vec2 vUv;

void main() {
    vec3 pos = position;
    
    float n = noise(vec2(pos.x + uSeed, pos.y - uSeed - uTime * 0.4));
    pos.z += n * 0.1;
    pos.x -= n * 0.1;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    if (!uIsOnLeft) {
        // Flip the Y axis so that the Y calculation is inverted for sphere
        vUv = vec2(uv.x, 1.0 - uv.y);
    } else {
        vUv = uv;
    }

    gl_Position = projectedPosition;
}

