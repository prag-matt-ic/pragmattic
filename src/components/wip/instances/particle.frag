uniform float uTime;

void main() {
   // Color of the mesh
  vec3 color = vec3(0.1294, 0.3294, 0.2314);


  // If inside the circle, render with the specified color and alpha
  gl_FragColor = vec4(color, 1.0);
}



