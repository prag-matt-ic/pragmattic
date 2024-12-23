// Torus Points Vertex shader
#pragma glslify: easeElastic = require('glsl-easings/elastic-out')
#pragma glslify: rotateTorus = require('../rotateTorus.glsl')
#pragma glslify: noiseTorus = require('../noise.glsl')

attribute vec3 inactivePosition;
attribute vec3 scatteredPosition;

uniform float uTime;
uniform float uRotateAngle;
uniform float uIntroScrollProgress;
uniform float uOutroScrollProgress;
uniform float uActiveProgress;

const float MIN_PT_SIZE = 64.0;
const float MAX_PT_SIZE = 160.0;

void main() {
    vec3 particlePosition = mix(scatteredPosition, inactivePosition, uIntroScrollProgress);
    particlePosition = mix(particlePosition, scatteredPosition, uOutroScrollProgress);
    particlePosition = mix(particlePosition, position, uActiveProgress);

    particlePosition = rotateTorus(particlePosition, uRotateAngle);
    particlePosition = noiseTorus(particlePosition, uTime);

    vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    float attenuationFactor = 1.0 / projectedPosition.z;
    float pointSize = clamp(MIN_PT_SIZE, MAX_PT_SIZE, MAX_PT_SIZE * attenuationFactor);

    gl_Position = projectedPosition;
    gl_PointSize = pointSize;
    
}
