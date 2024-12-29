// Torus Points Fragment shader
#pragma glslify: noise = require('glsl-noise/simplex/3d')

#pragma glslify: getRingAlpha = require('../ring.glsl')

#define MAX_ITERATIONS 20
#define MIN_DISTANCE 0.01
#define MAX_DISTANCE 5.00
#define TORUS_POS vec3(0.0, 0.0, 1.5)
#define LIGHT_POS vec3(0.5, -0.5, 0.0)

#define ALPHA 0.7 // points fade in when inactive (normal state)
#define ACTIVE_ALPHA 0.0 // points fade out when active
#define OUTRO_ALPHA 0.0 // points fade out when outro is triggered

uniform float uTime;
uniform float uActiveProgress;
uniform float uIntroScrollProgress;
uniform float uOutroScrollProgress;
uniform vec3 uColour;


// 2D rotation matrix
mat2 rot2D(in float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

// Torus
float sdTorus(in vec3 p, in vec2 t) {
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

// Map function for the scene (torus)
float getDistance (in vec3 p) {
    vec3 torusP = p - TORUS_POS;
    torusP.yz *= rot2D(-0.75);
    float dTorus = sdTorus(torusP, vec2(0.5, 0.15));
    return dTorus;
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

float getLight(in vec3 p) {
  vec3 l = normalize(LIGHT_POS - p);
  vec3 n = getNormal(p);
  float dif = clamp(dot(n, l), 0., 1.0);
  dif = pow(dif, 1.5); // make brigher
  return dif;
}


void main() {
    // Interaction based alpha
    float alpha = mix(0.0, ALPHA, uIntroScrollProgress);
    alpha = mix(alpha, ACTIVE_ALPHA, uActiveProgress);
    alpha = mix(alpha, OUTRO_ALPHA, uOutroScrollProgress);

    // Calculate the distance from the center of the point (normalized to [0, 1])
    vec2 coord = gl_PointCoord - vec2(0.5);

    // Ray marching to draw the torus
    vec3 ro = vec3(0.0, 0.0, 0.0);
    vec3 rd = normalize(vec3(coord, 1.0));
    float td = rayMarch(ro, rd); // Total distance travelled
    vec3 p = ro + rd * td;

    float diffuse = getLight(p);
    vec3 colour = uColour * diffuse;

    vec4 finalColour = vec4(colour, alpha);

    gl_FragColor = finalColour;
}