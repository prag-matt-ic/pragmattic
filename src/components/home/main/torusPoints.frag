#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uTransitionStartTime;

uniform bool uIsActive;
uniform vec3 uColour;

varying vec3 vViewPosition;

const float TRANSITION_DURATION = 1.2;

  void main() {
    vec2 normalizedPoint = gl_PointCoord - vec2(0.5);
    float dist = length(normalizedPoint);
    float circleAlpha = 1.0 - dist;

    float transitionProgress = smoothstep(
        0.0, 
        TRANSITION_DURATION, 
        uTime - uTransitionStartTime
    );

    float progress = uIsActive ? 1.0 - transitionProgress : transitionProgress;
    
    float activeAlpha = 0.0;
    float inactiveAlpha = 0.6;
    
    float alpha = mix(activeAlpha, inactiveAlpha, progress);

    // Reduce opacity with distance
    // float vdist = length(vViewPosition);
    // float fadeOutAlpha = 1.0 - smoothstep(8.0, 11.0, dist);
    
    vec4 finalColour = vec4(uColour, circleAlpha * alpha);

    gl_FragColor = finalColour;
  }