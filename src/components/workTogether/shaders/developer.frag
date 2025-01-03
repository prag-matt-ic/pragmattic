#version 300 es
#ifdef GL_ES
precision mediump float;
#endif

// DEVELOPERS WORK TOGETHER SHADER

#pragma glslify: noise = require('glsl-noise/simplex/3d')

#define MAX_ITERATIONS 20
#define MIN_DISTANCE 0.001
#define MAX_DISTANCE 5.0
#define PI 3.141592653


uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_black;
uniform vec3 u_cyan;
uniform vec3 u_light;

const float FOV = 90.0;
const float FOV_MULTIPLIER = tan(PI * 0.5 * FOV / 180.0); // Convert FOV to radians

in vec2 v_uv;
out vec4 outColor; 

// 2D rotation matrix
mat2 rot2D(in float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float sdSphere(in vec3 p, in float s) {
  return length(p) - s;
}

struct DistColour {
  float dist;
  vec3 colour;
};

// Rotational (angular) repetition that places spheres on a ring of radius `ringRadius`.
DistColour sdRepeatedSphereRing(in vec3 p, in int n, in float ringRadius, in float sphereRadius)
{
    // Step in angle for each repetition (2π / n)
    float sp = PI * 2.0 / float(n);         
    
    // Current angle of (x, y) in [-π, π]
    float an = atan(p.y, p.x);
    
    // Which "slice" or angular sector we are in
    float id = floor(an / sp);

    // Center angles for this slice (id) and the next slice (id+1).
    // The +0.5 places the sphere nicely centered within each sector.
    float a1 = sp * (id + 0.5);
    float a2 = sp * (id + 1.5);

    // Compute ring centers for slice id and id+1
    // Both live at distance ringRadius from the origin.
    vec2 c1 = ringRadius * vec2(cos(a1), sin(a1));
    vec2 c2 = ringRadius * vec2(cos(a2), sin(a2));

    // Shift p into each local coordinate system where a sphere is at the origin.
    vec3 p1 = p - vec3(c1, 0.0);
    vec3 p2 = p - vec3(c2, 0.0);

    // Evaluate SDF on each shifted position, returning the minimum distance.
    float d1 = sdSphere(p1, sphereRadius);
    float d2 = sdSphere(p2, sphereRadius);

    DistColour result;
    result.dist = min(d1, d2);
    result.colour = mix(u_light, u_cyan, sin(u_time) * 0.5 + 0.5);

    return result;
}

DistColour getDistanceAndColor(in vec3 p) {
    vec3 sphereP = p;
    sphereP.xy *= rot2D(u_time * 0.5);
    return sdRepeatedSphereRing(sphereP, 6, 1.0, 0.33);
}

float getDistance(in vec3 p) {
    return getDistanceAndColor(p).dist;
}

float rayMarch(in vec3 ro, in vec3 rd, inout vec3 colour) {
  // Loop through the raymarching algorithm
  float t = 0.0;  // Total distance travelled

  for (int i = 0; i < MAX_ITERATIONS; i++) {
    vec3 p = ro + rd * t; // Current point on the ray
    DistColour res = getDistanceAndColor(p);  // Distance to the closest surface
    float d = res.dist; // Distance to the closest surface

    if (d <= MIN_DISTANCE) {
        colour = res.colour; // Set color if the surface is hit
        break;
    }; // Break if we are close enough to an object
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

float getLight(in vec3 p, in vec3 camPos, in vec3 lightPos, in float intensity) {
    // Compute the light direction vector
    vec3 l = normalize(lightPos - p);
    
    // Compute the normal at the point `p`
    vec3 n = getNormal(p);
    
    // Diffuse lighting (Lambertian reflection) I=L⋅N
    float dif = clamp(dot(l, n), 0.0, 1.0);

    // Compute soft shadowing
    // REMOVED

    // Compute distance attenuation
    float dist = length(lightPos - p); // Distance to the light source
    float attenuation = clamp(1.0 / (dist * dist), 0.0, 1.0);

    // Modulate diffuse lighting by attenuation and intensity
    dif *= attenuation * intensity;

    // Add ambient lighting (baseline illumination)
    float ambient = 0.3;
    float lightContribution = dif + ambient;

    // Specular highlights (Blinn-Phong model)
    vec3 viewDir = normalize(camPos - p); // View direction 

    vec3 halfDir = normalize(l + viewDir); // Halfway vector
    float spec = pow(clamp(dot(n, halfDir), 0.0, 1.0), 2.0); // Specular exponent

    // Modulate specular with shadowing and attenuation
    spec *= attenuation * intensity;

    // Combine diffuse, ambient, and specular contributions
    lightContribution += spec * 1.2; // Scale specular for balance

    return lightContribution;
}


void main() {
    vec2 uv = v_uv;
    uv *= FOV_MULTIPLIER;
    // Camera position around origin
    float angle = u_time;
    float radius = 1.8;
    vec3 ro = radius * vec3(cos(angle), cos(angle) - 0.5, sin(angle));

    // Look-at direction points from ro → 0 => -ro
    vec3 forward = normalize(-ro);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, forward);
    
    vec3 rd = normalize(forward + uv.x * right + uv.y * up);

    vec3 colour = u_black;

    float td = rayMarch(ro, rd, colour); // Total distance travelled
    vec3 p = ro + rd * td; // Position of the hit

    float diffuse = getLight(p, ro, vec3(0.0, 0.5, 0.0), 0.8);
    colour *= diffuse;

    outColor = vec4(colour, 1.0);
}





