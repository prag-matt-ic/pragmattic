// Energy Cylinder Vertex Shader

#pragma glslify: noise = require('glsl-noise/simplex/2d')

uniform float uTime;

varying vec2 vUv;

void main() {

    vec3 pos = position;
    
    float n = noise(vec2(pos.x * 4.0, pos.y * 0.2 - uTime * 0.5));
    pos.x += n * 0.1;
    pos.z -= n * 0.1;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    vUv = uv;

    gl_Position = projectedPosition;
}

