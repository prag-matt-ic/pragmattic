#pragma glslify: noise = require('glsl-noise/simplex/3d')
#define MAX_ITERATIONS 20
#define MIN_DISTANCE 0.001
#define MAX_DISTANCE 5.00

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

// Sphere
float sdSphere(in vec3 p, in float s) {
  return length(p) - s;
}

float getSinTime () {
  // float timeMultiplier = uTime;
  return sin(uTime) * 0.5 + 0.5;
}

float sdNoiseSphere(in vec3 p, in float s, in float index, in float t) {
  float amplitude = 0.06 * t;
  float n = noise(vec3(p.x * 2.0 - index, p.y * 2.0 - index, uTime * 1.5)) * amplitude;
  return sdSphere(p + n, s);
}

// Map function for the scene (torus)
float getDistance (in vec3 p) {
    float t = getSinTime();
    float offset = t * 0.9;  
    float radius = 0.7 - (0.35 * t);
    // Sphere 1 
    float dSphere1 = sdNoiseSphere(p - vec3(offset, 0.0, 0.), radius, 1.0, t);
    // Sphere 2
    float dSphere2 = sdNoiseSphere(p - vec3(-offset, 0.0, 0.), radius, 2.0, t);
    float d = smin(dSphere1, dSphere2, 0.75);
    return d;
}

float rayMarch(in vec3 ro, in vec3 rd) {
  // Loop through the raymarching algorithm
  float t = 0.0;  // Total distance travelled

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
    float shadowContrast = 1.2; // Controls shadow intensity curve
    s = pow(s, shadowContrast); // Apply contrast adjustment to shadow factor
    // Apply shadow attenuation to diffuse lighting
    dif *= s;

    // Compute distance attenuation
    float dist = length(lightPos - p); // Distance to the light source
    float attenuation = clamp(1.0 / (dist * dist), 0.0, 1.0);

    // Modulate diffuse lighting by attenuation and intensity
    dif *= attenuation * intensity;

    // Add ambient lighting (baseline illumination)
    float ambient = 0.3; // Ambient light intensity
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
    // // Camera position around origin
    float angle = uTime * 0.6;  
    float radius = 1.8;
    vec3 ro = radius * vec3(cos(angle), 0.0, sin(angle));

    // Look-at direction points from ro → 0 => -ro
    vec3 forward = normalize(-ro);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, forward);
    
    vec3 rd = normalize(forward + vUv.x * right + vUv.y * up);

    float td = rayMarch(ro, rd); // Total distance travelled
    vec3 p = ro + rd * td; // Position of the hit

    float diffuse = getLight(p, ro, vec3(1.25, 2.5, 0.0), 6.0);

    float t = getSinTime();
    vec3 sphereColour = mix(uIsHovered ? uActiveColour : uLightColour, uLightColour, t);
    sphereColour *= diffuse;

    // If distance == max distance, we didn't hit anything = color the background
    vec3 colour = mix(uDarkColour, sphereColour, step(td, MAX_DISTANCE));

    gl_FragColor = vec4(colour, 1.0);
}





