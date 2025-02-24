#pragma glslify: noise = require('glsl-noise/simplex/3d')

vec3 noiseTorus(inout vec3 position, in float uTime) { 
    float noiseFactor = noise(vec3(position * 0.33) + (uTime * 0.2));
    position.z += noiseFactor * 0.6;
    return position;
}

#pragma glslify: export(noiseTorus)