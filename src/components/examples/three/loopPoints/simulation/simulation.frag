// Import a 3D simplex noise function from the glsl-noise library.
// This function generates smooth, pseudo-random noise in 3D
#pragma glslify: snoise = require('glsl-noise/simplex/3d')

// Uniforms provided from the CPU side of the simulation
uniform float uTime; 
uniform sampler2D uScatteredPositions;
uniform sampler2D uLoopPositions;
uniform float uScatteredAmount;  // Value between 0 and 1

// Varying passed from the vertex shader: texture coordinates for sampling.
varying vec2 vUv;

// Function to generate a 3D noise vector.
// It samples the 3D noise function three times with different offsets to create three independent components.
vec3 snoiseVec3(in vec3 x){
  // First component from the base noise.
  float s  = snoise(vec3(x));
  // Second component with a shifted coordinate to ensure variation.
  float s1 = snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2));
  // Third component with another offset.
  float s2 = snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4));
  // Combine the three samples into a vector.
  vec3 c = vec3(s, s1, s2);
  return c;
}

// Function to compute the curl noise of a 3D vector field.
// Curl noise is useful for generating divergence-free (swirling) motions.
vec3 curlNoise(in vec3 p ){
  // Small offset value for finite differences.
  const float e = 0.1;
  
  // Create offset vectors along each axis.
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  // Sample the noise vector at slightly offset positions along the x-axis.
  vec3 p_x0 = snoiseVec3(p - dx);
  vec3 p_x1 = snoiseVec3(p + dx);
  
  // Sample the noise vector at slightly offset positions along the y-axis.
  vec3 p_y0 = snoiseVec3(p - dy);
  vec3 p_y1 = snoiseVec3(p + dy);
  
  // Sample the noise vector at slightly offset positions along the z-axis.
  vec3 p_z0 = snoiseVec3(p - dz);
  vec3 p_z1 = snoiseVec3(p + dz);

  // Compute the finite differences to approximate partial derivatives.
  // The differences here approximate how the noise vector changes in space.
  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  // The divisor scales the derivative approximation.
  const float divisor = 1.0 / (2.0 * e);
  // Normalize the curl vector to keep its magnitude consistent.
  return normalize(vec3(x, y, z) * divisor);
}

// Main fragment shader function.
void main() {
  // Retrieve the particle's scattered position from a texture using its UV coordinates.
  vec3 scatteredPos = texture2D(uScatteredPositions, vUv).xyz;
  // Retrieve the particle's looped (base) position from another texture.
  vec3 loopPos = texture2D(uLoopPositions, vUv).xyz;
  // Blend the two positions based on uScatteredAmount.
  // When uScatteredAmount is 0, loopPos is used; when it's 1, scatteredPos is used.
  vec3 pos = mix(loopPos, scatteredPos, uScatteredAmount);

  // Calculate a curl noise vector based on the current position.
  // The position is scaled and offset by time to animate the noise field.
  vec3 noiseVec = curlNoise(pos * 0.25 + uTime * 0.3);
  
  // Apply the noise vector to displace the position.
  // The multiplier (0.2) controls the strength of the noise effect.
  pos += noiseVec * 0.2;
  
  // Output the final position as the fragment color.
  // The alpha component is set to 1.0 (fully opaque).
  gl_FragColor = vec4(pos, 1.0);
}
