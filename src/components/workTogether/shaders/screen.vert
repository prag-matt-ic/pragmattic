varying vec2 vUv;

void main() {
    vUv = position.xy;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
