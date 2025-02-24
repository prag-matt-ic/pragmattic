float getRingAlpha(in vec2 coord, in float uTime) { 
    float dist = length(coord);
    float time = sin(uTime) * 0.5 + 0.5;
    float innerStep = 0.4 - 0.2 * time;
    float innerAlpha = step(innerStep, dist) * 0.5;
    float outerAlpha = 1.0 - step(0.5, dist);
    float circleAlpha = innerAlpha * outerAlpha;
    return circleAlpha;
}

#pragma glslify: export(getRingAlpha)