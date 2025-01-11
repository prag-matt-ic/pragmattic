// STARTUP WORK TOGETHER SHADER
#pragma glslify: noise = require('glsl-noise/simplex/3d')

#define MAX_ITERATIONS 30
#define MIN_DISTANCE 0.001
#define MAX_DISTANCE 6.0

uniform float uTime;
uniform bool uIsHovered;
uniform vec3 uLightColour;
uniform vec3 uDarkColour;
uniform vec3 uActiveColour;

varying vec2 vUv;

// 2D rotation matrix
mat2 rot2D(in float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

// Smooth minimum function
// Note: K can be animated to adjust the merge intensity of the two shapes
float smin(in float a, in float b, in float k) {
  float h = max(k - abs(a-b), 0.0) / k;
  return min(a, b) - h * h * h * k * (1.0/6.0);
}

// Torus
float sdTorus(in vec3 p, in vec2 t) {
    vec2 q = vec2(length(p.xz)-t.x,p.y);
    return length(q)-t.y;
}

// Sphere
float sdSphere(in vec3 p, in float s) {
  return length(p) - s;
}

float getSinTime() {
  return sin(uTime * 0.8) * 0.5 + 0.5;
}

float sdNoiseSphere(in vec3 p, in float s, in float t) {
  float amplitude = 0.07 * (1.0 - t);
  float n = noise(vec3(p * 2.4)) * amplitude;
  return sdSphere(p + n, s);
}

// Map function for the scene (torus)
float getDistance (in vec3 p) {
    // Ground plane 
    float dPlane = p.y;

    float t = getSinTime();
    float y = t * 2.8 - 1.3;
    float radius = 1.2 - 0.7 * t;

    float dSphere = sdNoiseSphere(p - vec3(0.0, y, 0.0), radius, t);
    float d = smin(dPlane, dSphere, 0.8);
    return d;
}

float rayMarch(in vec3 ro, in vec3 rd) {
  // Loop through the raymarching algorithm
  float t = 0.0; // Total distance travelled

  for (int i = 0; i < MAX_ITERATIONS; i++) {
    vec3 p = ro + rd * t; // Current point on the ray
    float d = getDistance(p);  // Distance to the closest surface
    if (d < MIN_DISTANCE) break; // Break if we are close enough to an object
    t += d; // Move the ray forward
    if (t > MAX_DISTANCE) break; // Break if we are too far away
  }

  return t;
}

vec3 getNormal(in vec3 p) {
    float d = getDistance(p);
    vec2 e = vec2(.01, 0);
    vec3 n = d - vec3(getDistance(p-e.xyy), getDistance(p-e.yxy), getDistance(p-e.yyx));
    return normalize(n);
}

float softShadow(in vec3 ro, in vec3 rd, float mint, float maxt, float w) {
    // 'w' influences how quickly the shadow factor drops off
    float res = 1.0;
    float t = mint;
    for (int i = 0; i < 64 && t < maxt; i++) {
        float h = getDistance(ro + t * rd);
        // Keep track of the minimum ratio of distance to 'w*t'
        res = min(res, h / (w * t));
        // March forward
        t += clamp(h, 0.005, 0.50);
        // If res gets too negative or we exceed max distance, break early
        if (res < -1.0 || t > maxt) break;
    }
    // Clamp to at least -1.0
    res = max(res, -1.0);

    // A polynomial remap to get softer edges (often called "k factor")
    // 0.25*(1+res)*(1+res)*(2-res) is a trick to keep soft shadows stable
    return 0.25 * (1.0 + res) * (1.0 + res) * (2.0 - res);
}


float getLight(in vec3 p, in vec3 camPos, in vec3 lightPos, in float intensity) {
    // Compute the light direction vector
    vec3 l = normalize(lightPos - p);
    
    // Compute the normal at the point `p`
    vec3 n = getNormal(p);
    
    // Diffuse lighting (Lambertian reflection) I=L⋅N
    float dif = clamp(dot(l, n), 0.0, 1.0);

    // Compute soft shadowing
    vec3 roOffset = p + n * 0.01; // Prevent self-shadowing
    float s = softShadow(roOffset, l, 0.05, length(lightPos - p), 8.0);

    // Adjust shadow contrast
    float shadowContrast = 1.4; // Controls shadow intensity curve
    s = pow(s, shadowContrast); // Apply contrast adjustment to shadow factor
    // Apply shadow attenuation to diffuse lighting
    dif *= s;

    // Compute distance attenuation
    float dist = length(lightPos - p); // Distance to the light source
    float attenuation = clamp(1.0 / (dist * dist), 0.0, 1.0);

    // Modulate diffuse lighting by attenuation and intensity
    dif *= attenuation * intensity;

    // Add ambient lighting (baseline illumination)
    float ambient = 0.2; // Ambient light intensity
    float lightContribution = dif + ambient;

    // Specular highlights (Blinn-Phong model)
    vec3 viewDir = normalize(camPos - p); // View direction 

    vec3 halfDir = normalize(l + viewDir); // Halfway vector
    float spec = pow(clamp(dot(n, halfDir), 0.0, 1.0), 2.0); // Specular exponent

    // Modulate specular with shadowing and attenuation
    spec *= s * attenuation * intensity;

    // Combine diffuse, ambient, and specular contributions
    lightContribution += spec * 1.5; // Scale specular for balance

    return lightContribution;
}


void main() {
    // Define the ray origin (camera position)
    vec3 ro = vec3(0.0, 1.0, -2.0);

    // Define the ray direction  
    vec3 rd = normalize(vec3(vUv, 1.0));

    float td = rayMarch(ro, rd); // Total distance travelled
    vec3 p = ro + rd * td; // Position of the hit

    if (td >= MAX_DISTANCE) {
        gl_FragColor = vec4(uDarkColour, 1.0);
        return;
    }

    float diffuse = getLight(p, ro, vec3(1.2, 3.0, 0.0), 4.0);

    float t = getSinTime();
    vec3 sphereColour = mix(uLightColour, uIsHovered ? uActiveColour : uLightColour, t);
    sphereColour *= diffuse;

    gl_FragColor = vec4(sphereColour, 1.0);
}





