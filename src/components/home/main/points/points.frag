// Points Fragment shader
#pragma glslify: getRingAlpha = require('../ring.glsl')

#define MAX_ITERATIONS 24
#define MIN_DISTANCE 0.001
#define MAX_DISTANCE 5.00

varying vec3 vColour;
varying vec3 vViewPosition;

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

// Main Map function for the scene (torus)
float getDistance (in vec3 p) {
    vec3 torusPos = vec3(0.0, 0.0, 1.5);
    vec3 torusP = p - torusPos;
    float rotation = 0.5 + uTime + pow(vViewPosition.y * vViewPosition.x, 2.0);
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

float getLight(in vec3 p, in vec3 lightPos) {
  vec3 l = normalize(lightPos - p);
  vec3 n = getNormal(p);
  float dif = clamp(dot(n, l), 0., 1.0);

  // make brigher
  dif = pow(dif, 1.5);
  return dif;
}

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);

  // Ray marching to draw the torus
  // Ray origin (camera position)
  vec3 ro = vec3(0.0, 0.0, 0.0);
  // Ray direction
  vec3 rd = normalize(vec3(coord, 1.0));

  float td = rayMarch(ro, rd); // Total distance travelled
  vec3 p = ro + rd * td; // Current point on the ray

  vec3 lightPos = vec3(0.5, -0.5, 0.0);
  float diffuse = getLight(p, lightPos);
  vec3 colour = vColour * diffuse;
  vec4 finalColour = vec4(colour, 1.0);
  
  gl_FragColor = finalColour;
}