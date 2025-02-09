// Environment sphere Vertex Shader
varying vec3 vWorldPos;
varying vec2 vUv;

void main() {   
    // Compute the world‐space position of this vertex
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    vWorldPos = worldPosition.xyz;
    vUv = uv;
    
    // Standard projection
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}