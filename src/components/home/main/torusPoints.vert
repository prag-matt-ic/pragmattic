// Torus Points Vertex shader
#pragma glslify: easeElastic = require('glsl-easings/elastic-out') 
#pragma glslify: easeSine= require('glsl-easings/sine-in') 

#pragma glslify: rotateTorus = require('./rotation.glsl')
#pragma glslify: noiseTorus = require('./noise.glsl')

// #pragma glslify: noise = require('glsl-noise/simplex/3d')


attribute vec3 inactivePosition;
attribute vec3 scatteredPosition;

uniform float uTime;
uniform float uTransitionStartTime;
uniform float uRotateSpeed;
uniform bool uIsActive;
uniform float uScrollProgress;

// varying vec3 vViewPosition;

const float INTRO_DURATION = 3.0;
const vec3 INTRO_POSITION = vec3(0.0, 0.0, 3.0);

const float TRANSITION_DURATION = 0.5;
const float ACTIVE_TRANSITION_DELAY = 0.0;
const float INACTIVE_TRANSITION_DELAY = 1.2;
const float MIN_PT_SIZE = 4.0;
const float MAX_PT_SIZE = 64.0;

void main() {
    // If the time is less than the intro duration, then mix between INTRO_POSITION and scatteredPosition

    float introProgress = smoothstep(0.0, INTRO_DURATION, uTime);
    introProgress = easeElastic(introProgress);

    float delay = uIsActive ? ACTIVE_TRANSITION_DELAY : INACTIVE_TRANSITION_DELAY;
    float adjustedTime = uTime - uTransitionStartTime - delay;

    float transitionProgress = smoothstep(0.0, TRANSITION_DURATION, adjustedTime);
    float progress = uIsActive ? 1.0 - transitionProgress : transitionProgress;
    progress = easeSine(progress);

    // Update positions
    vec3 introPosition = mix(INTRO_POSITION, scatteredPosition, introProgress);
    
    vec3 particlePosition = mix(introPosition, inactivePosition, uScrollProgress);
    particlePosition = mix(position, particlePosition, progress);

    particlePosition = rotateTorus(particlePosition, uTime, uRotateSpeed);
    particlePosition = noiseTorus(particlePosition, uTime);

    vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    float attenuationFactor = 1.0 / projectedPosition.z;
    float pointSize = clamp(MIN_PT_SIZE, MAX_PT_SIZE, MAX_PT_SIZE * attenuationFactor);

    gl_Position = projectedPosition;
    gl_PointSize = pointSize;
    
}
