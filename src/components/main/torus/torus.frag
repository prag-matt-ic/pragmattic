// Torus Fragment shader
#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform vec3 uColour;
uniform vec3 uActiveColour;
uniform float uActiveProgress; // value between 0 and 1

uniform float uRadius;
uniform float uTube;

varying vec2 vUv;

void main() {

    // Animate the colour change vertically
    float size = uRadius + uTube;
    float startValue = mix(-size * 1.2, size * 1.2, uActiveProgress);
    float endValue = mix(-size * 1.2, size * 1.2, clamp(uActiveProgress * 1.8, 0.0, 1.0));
        
    float xNoise = noise(vec3(vViewPosition.xy * 16.0, uTime)) * 0.5 + 0.5 * 0.2;
    // view position.y = 0 is the center of the torus
    float mixFactor = smoothstep(startValue, endValue, vViewPosition.y + (xNoise * (1.0 - uActiveProgress)));
    // Blend between the two colors
    vec3 blendedColour = mix(uActiveColour, uColour, mixFactor);

    vec3 solidColour = mix(uColour, uActiveColour, uActiveProgress);
    vec3 colour = mix(blendedColour, solidColour, step(1.0, uActiveProgress));
    vec4 finalColor = vec4(blendedColour, 1.0);

    finalColor.a *= uActiveProgress;

    csm_DiffuseColor = finalColor;
}




