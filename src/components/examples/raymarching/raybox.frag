
#pragma glslify: noise = require(glsl-noise/simplex/3d)

uniform float uTime;
uniform float uAspect;
uniform vec2 uPointer; // NDC coordinates of the mouse pointer
uniform float uScrollProgress;

varying vec2 vUv;

#define FOV 80.0
#define PI 3.14159265359
#define MAX_ITERATIONS 80
#define MIN_DISTANCE 0.001
#define MAX_DISTANCE 60.0

#define SHADOWS 0
#define GRID 2.0

const float FOV_MULTIPLIER = tan(PI * 0.5 * FOV / 180.0); // Convert FOV to radians

// Smooth minimum function
// Note: K can be animated to adjust the merge intensity of the two shapes
float smin(in float a, in float b, in float k) {
  float h = max(k - abs(a-b), 0.0) / k;
  return min(a, b) - h * h * h * k * (1.0/6.0);
}

// 2D rotation matrix
mat2 rot2D(in float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float sdBox(in vec3 p, in vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

struct DistColour {
  float dist;  // The signed distance to the fractal
  vec3 colour;  // The color of the fractal at this point
};

DistColour getBoxDistColour(in vec3 p, in bool calcColour) {

    vec3 b = vec3(0.25); // Size of the largest box

    vec3 offsetP = vec3(p.x, p.y, p.z - uScrollProgress * 80.0); // Move the box in z
    vec3 boxP = mod(offsetP, GRID) - GRID / 2.0; // Center the fractal
    boxP.xz *= rot2D(-uTime - p.y);     // rotate the box 

    float d = sdBox(boxP, b);  // Distance to the box
    vec3 colour = vec3(0.0);  

    if (calcColour) {
      // Colour each box differently
      // Determine the grid coordinates (static position snapped to grid)
      vec3 gridPosition = floor(offsetP / GRID);

      // Map grid coordinates to unique colors
       colour = vec3(
          fract(sin(dot(gridPosition.xy, vec2(12.9898, 78.233))) * 43758.5453),
          fract(sin(dot(gridPosition.yz, vec2(45.164, 97.345))) * 43758.5453),
          fract(sin(dot(gridPosition.zx, vec2(34.678, 12.345))) * 438.5453)
      );
    }

    DistColour result;
    result.dist = d;
    result.colour = colour;
    return result;
}


// Map function for the scene
DistColour getDistanceAndColor(in vec3 p) {
  return getBoxDistColour(p, true);
}

float getDistance(in vec3 p) {
  return getBoxDistColour(p, false).dist;
}


vec3 getNormal(in vec3 p) {
	float d = getDistance(p);
  vec2 e = vec2(.01, 0);
  vec3 n = d - vec3(getDistance(p-e.xyy), getDistance(p-e.yxy), getDistance(p-e.yyx));
  return normalize(n);
}


float rayMarch(in vec3 ro, in vec3 rd, inout vec3 colour) {
  // Loop through the raymarching algorithm
  float td = 0.0; // Total distance travelled

  for(int i = 0; i < MAX_ITERATIONS; i++) {
    vec3 p = ro + rd * td; // Current point on the ray
    DistColour result = getDistanceAndColor(p);  // Distance to the closest surface
    float d = result.dist; // Distance to the closest surface
    
    if (abs(d) <= MIN_DISTANCE) {
        colour = result.colour; // Set color if the surface is hit
        break;
    }

    td += d; // Move the ray forward
    if (td > MAX_DISTANCE) break; // Break if we are too far away
  }

  return td; 
}


float softShadow(in vec3 ro, in vec3 rd, float mint, float maxt, float w) {
    // W influences how quickly the shadow factor drops off
    float res = 1.0;
    float t = mint;
    for (int i=0; i< 128 && t < maxt; i++) {
        float h = getDistance(ro + t*rd);
        res = min(res, h / (w * t));
        t += clamp(h, 0.005, 0.50);
        if (res <- 1.0 || t > maxt) break;
    }
    res = max(res,-1.0);
    return 0.25*(1.0+res)*(1.0+res)*(2.0-res);
}


float getLight(in vec3 p, in vec3 lightPos, in float intensity) {
    // Compute the light direction vector
    vec3 l = normalize(lightPos - p);
    
    // Compute the normal at the point `p`
    vec3 n = getNormal(p);
    
    // Diffuse lighting (Lambertian reflection) I=L⋅N
    float dif = clamp(dot(l, n), 0.0, 1.0);

    // Compute soft shadowing
    vec3 roOffset = p + n * 0.001; // Prevent self-shadowing
    float s = softShadow(roOffset, l, 0.1, length(lightPos - p), 8.0);

    // Adjust shadow contrast
    if (SHADOWS == 1) {
      float shadowContrast = 1.5; // Controls shadow intensity curve
      s = pow(s, shadowContrast); // Apply contrast adjustment to shadow factor
      // Apply shadow attenuation to diffuse lighting
      dif *= s;
    }

    // Compute distance attenuation
    float dist = length(lightPos - p); // Distance to the light source
    float attenuation = clamp(1.0 / (dist * dist), 0.0, 1.0);

    // Modulate diffuse lighting by attenuation and intensity
    dif *= attenuation * intensity;

    // Add ambient lighting (baseline illumination)
    float ambient = 0.1; // Ambient light intensity
    float lightContribution = dif + ambient;

    // Specular highlights (Blinn-Phong model)
    vec3 viewDir = normalize(-p); // Assume camera is at the origin
    vec3 halfDir = normalize(l + viewDir); // Halfway vector
    float spec = pow(clamp(dot(n, halfDir), 0.0, 1.0), 2.0); // Specular exponent

    // Modulate specular with shadowing and attenuation
    spec *= s * attenuation * intensity;

    // Combine diffuse, ambient, and specular contributions
    lightContribution += spec * 2.0; // Scale specular for balance

    return lightContribution;
}


void main() {
  // Normalize UV coordinates to [-1, 1]
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uAspect;
  uv *= FOV_MULTIPLIER;

  // Define the ray origin (camera position)
  vec3 ro = vec3(uPointer.x * 0.5, uPointer.y * 0.5, 0.0);

  // Define the ray direction
  float rayNoise = noise(vec3(uv * 0.5, uTime * 0.3)) * 0.1;
  
  vec3 rd = normalize(vec3(uv.x, uv.y, 1.0));
  // Rotate the ray using a sine function
  rd.xy *= rot2D(uScrollProgress * 16.0);
  // rd.x += rayNoise;

  vec3 colour = vec3(0.0); // Initialize the color

  // Raymarch the scene
  float td = rayMarch(ro, rd, colour); // Total distance travelled

  vec3 p = ro + rd * td; // Intersection point

  vec3 lightPos = vec3(0.0, 0.0, (sin(uTime) * 0.5 + 0.5) * 40.0 - 2.0);
  float lightIntensity = 16.0;
  float light = getLight(p, lightPos, lightIntensity);

  colour *= light; // Apply lighting
    
  gl_FragColor = vec4(colour, 1.0);
}






