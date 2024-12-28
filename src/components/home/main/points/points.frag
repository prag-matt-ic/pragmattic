// Points Fragment shader
#pragma glslify: getRingAlpha = require('../ring.glsl')

#define MAX_ITERATIONS 20
#define MIN_DISTANCE 0.01
#define MAX_DISTANCE 5.00
#define TORUS_POS vec3(0.0, 0.0, 1.5)
#define LIGHT_POS vec3(0.5, -0.5, 0.0)

varying vec3 vColour;
varying vec3 vPosition;

uniform float uTime;

// 2D rotation matrix
mat2 rot2D(in float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

// Torus distance function
float sdTorus(in vec3 p, in vec2 t) {
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

// Map function for the scene (torus)
float getDistance (in vec3 p) {
    vec3 torusP = p - TORUS_POS;
    float rotation = uTime + (vPosition.x * 33.);
    torusP.yz *= rot2D(rotation);
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

  // make brigher
  dif = pow(dif, 1.5);
  return dif;
}

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);

  // Ray marching
  // Ray origin (camera position)
  vec3 ro = vec3(0.0, 0.0, 0.0);
  // Ray direction
  vec3 rd = normalize(vec3(coord, 1.0));

  float td = rayMarch(ro, rd); // Total distance
  vec3 p = ro + rd * td; // Current point on the ray

  float diffuse = getLight(p);
  vec3 colour = vColour * diffuse;
  vec4 finalColour = vec4(colour, 0.8);
  
  gl_FragColor = finalColour;
}