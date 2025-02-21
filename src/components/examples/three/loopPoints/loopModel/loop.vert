// Loop Model Vertex shader

uniform float uTime;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec3 projectedPosition = position;
    // Add subtle x distortion using sin
    projectedPosition.x += sin(position.y * 2.0 + uTime) * 0.4;

    // Set the position for the CustomShaderMaterial
    csm_Position = projectedPosition;
}
