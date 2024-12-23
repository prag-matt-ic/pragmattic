
#pragma glslify: noise = require(glsl-noise/simplex/3d)

uniform float uTime;
uniform float uAspect;
uniform vec2 uPointer;

varying vec2 vUv;

#define FOV 50.0
#define PI 3.14159265359
#define MAX_ITERATIONS 80
#define MIN_DISTANCE 0.001
#define MAX_DISTANCE 20.00

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

float sdSphere (in vec3 p, in float radius) {
  return length(p) - radius;
}

float sdBox(in vec3 p, in vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float sdTorus(in vec3 p, in vec2 t) {
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

struct SceneInfo {
  float dist; // distance to the closest surface
  float id; // which shape it belongs to
};

// Map function for the scene
SceneInfo getSceneInfo (in vec3 p) {
    SceneInfo info;

    // ----- Ground plane
    float dGround = p.y + 0.2;  // distance to plane y=0

    // ----- Sphere
    vec3 spherePos = vec3(0.0, (sin(uTime * 2.) * 0.5 + 0.5) * 2.48 + 0.3, 5.0);
    float dSphere = sdSphere(p - spherePos, 0.2);

    // ----- Torus
    vec3 torusPos = vec3(0.0, 1.1, 5.0);
    vec3 torusP = p - torusPos;
    torusP.xz *= rot2D(uTime * 6.0);
    torusP.yz *= rot2D(uTime * 2.0);

    float dTorus = sdTorus(torusP, vec2(0.9, 0.1));

    // Smoothly merge sphere & torus
    float dSphereTorus = smin(dSphere, dTorus, (sin(uTime) * 0.5 + 0.5) + 0.6);
    // Decide which ID to pick. 
    // We'll say if the sphere is smaller, it "dominates" the ID,
    // otherwise the torus does.
    float sphereTorusID = (dSphere < dTorus) ? 2.0 : 3.0;

    // Merge them vs. the ground
    float minDist = dSphereTorus;
    float matID = sphereTorusID;

    if (dGround < minDist) {
        minDist = dGround;
        matID = 1.0; // ground
    }

    info.dist = minDist;
    info.id = matID;

    return info;
}

float getDistanceOnly(in vec3 p) {
    return getSceneInfo(p).dist;
}

vec3 getNormal(in vec3 p) {
	float d = getDistanceOnly(p);
  vec2 e = vec2(.01, 0);
  vec3 n = d - vec3(getDistanceOnly(p-e.xyy), getDistanceOnly(p-e.yxy), getDistanceOnly(p-e.yyx));
  return normalize(n);
}

float rayMarch(in vec3 ro, in vec3 rd) {
  // Loop through the raymarching algorithm
  float t = 0.0;  // Total distance travelled

  for(int i = 0; i < MAX_ITERATIONS; i++) {
    vec3 p = ro + rd * t; // Current point on the ray
    float d = getSceneInfo(p).dist;  // Distance to the closest surface
    if (d < MIN_DISTANCE) break; // Break if we are close enough to an object
    t += d; // Move the ray forward
    if(t > MAX_DISTANCE) break; // Break if we are too far away
  }

  return t;
}


float softShadow(in vec3 ro, in vec3 rd, float mint, float maxt, float w) {
    // w influences how quickly the shadow factor drops off
    float res = 1.0;
    float t = mint;
    for( int i=0; i< 256 && t < maxt; i++ ) {
        float h = getDistanceOnly(ro + t*rd);
        res = min(res, h / (w * t));
        t += clamp(h, 0.005, 0.50);
        if (res <- 1.0 || t > maxt) break;
    }
    res = max(res,-1.0);
    return 0.25*(1.0+res)*(1.0+res)*(2.0-res);
}


float getLight(in vec3 p, in vec3 lightPos, in float intensity) {
    vec3 l = normalize(lightPos - p);
    vec3 n = getNormal(p);
    float dif = clamp(dot(n, l), 0.0, 1.0);
    
    // Ray origin offset to avoid self-shadowing
    vec3 roOffset = p + n * 0.001;
    float s = softShadow(roOffset, l, 0.1, length(lightPos - p), 8.0);

    // Adjust the shadow contrast
    float shadowContrast = 1.5;
    s = pow(s, shadowContrast);
    dif *= s;

    // Distance attenuation
    float dist = length(lightPos - p);
    // Simple attenuation (inverse-squared)
    float attenuation = clamp(2.0 / (dist * dist), 0.0, 1.0);
    // Multiply the diffuse by attenuation
    dif *= attenuation;

    // Intensity
    dif *= intensity;
    
    return dif;
}

 

void main() {
  // Update UV coordinates to aspect ratio
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uAspect;
  uv *= FOV_MULTIPLIER;

  // Define the ray origin (camera position)
  float rayY = sin(uTime * 0.8) * 0.25 + 1.25;
  vec3 ro = vec3(0.0, rayY, 0.0);

  // Define the ray direction
  float rayNoise = noise(vec3(uv, uTime * 0.3)) * 0.1;
  vec3 rd = normalize(vec3(uv.x + rayNoise, uv.y, 1.0));

  vec3 lightDir = normalize(vec3(0.0, 1.0, 1.0));
  float lightIntensity = dot(lightDir, rd) * 0.5 + 0.5;

  // Raymarch the scene
  float t = rayMarch(ro, rd);

  vec3 p = ro + rd * t;

  SceneInfo si = getSceneInfo(p);
  float shapeID = si.id; 

  vec3 colour = shapeID == 1. ? vec3(0.3, 0.5, 0.4) : vec3(0.2, 0.3, 0.4);


  float light1Dif = getLight(p, vec3(-1.0, 2., 3.), 10.0);
  // float light2Dif = getLight(p, vec3(0.0, 2.0, 2.0), 20.0);

  // colour *= max(light1Dif, light2Dif);
  colour *= clamp(1.0, 4.0, light1Dif);
    
  vec3 finalColour = vec3(colour);
  finalColour = pow(finalColour, vec3(.4545));	// gamma correction
  
  gl_FragColor = vec4(colour,1.0);
}






