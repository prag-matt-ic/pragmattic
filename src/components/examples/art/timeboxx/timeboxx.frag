
#pragma glslify: noise = require(glsl-noise/simplex/3d)

uniform float uTime;
uniform float uAspect;
uniform float uScrollProgress;

uniform vec3 uBgColour;
uniform vec3 uGroundColour;
uniform vec3 uBgBoxColour;

uniform bool uIsActive;
uniform vec3 uActiveBoxColour;

varying vec2 vUv;

#define FOV 70.0
#define PI 3.14159265359
#define MAX_ITERATIONS 120
#define MIN_DISTANCE 0.001
#define MAX_DISTANCE 80.0
#define SHADOWS 1

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

DistColour map(in vec3 p, in bool calcColour) {
  // Foreground box
  vec3 boxP = p - vec3(0.5, 0.6, 1.5);
  boxP.xz *= rot2D(uTime * 0.5); // Rotate the box
  vec3 box = vec3(0.075);
  float boxD = sdBox(boxP, box);

  // Background boxes
  vec3 boxesP = p - vec3(0.0 + uTime * 0.05, 0.5, 3.0); 
  // float angle = p.z * 0.5;
  // boxesP.yz *= rot2D(angle); // Rotate the box
  boxesP = mod(boxesP, 0.5) - 0.25; // Center the fractal
  vec3 boxes = vec3(0.1);
  float boxesD = sdBox(boxesP, boxes);

  // Foreground clipping Box
  // Clips the background boxes
  // vec3 clipBoxP = p;
  // clipBoxP.xz *= rot2D(0.5); // Rotate the box
  vec3 clipBox = vec3(5.0, 5.0, 3.0);
  float clipBoxD = sdBox(p, clipBox);

// TODO: Optimise this, just use a z value clip.
  // "Cut out" the foreground region from boxes
  // vec3 clipBoxColour = vec3(1.0, 0.0, 0.0);
  float clippedBoxesD = max(boxesD, -clipBoxD); 

  DistColour distColour; // Returns the distance and color of the closest surface

  float minDistance = min(uIsActive ? boxD : MAX_DISTANCE, clippedBoxesD);
  // minDistance = min(clipBoxD, minDistance);

  distColour.dist = minDistance;
  distColour.colour = uBgBoxColour;

  // Assign the colour of the closest surface
  if (boxD == minDistance) {
    distColour.colour = uActiveBoxColour;
  }

  if (boxesD == minDistance) {
    distColour.colour = uBgBoxColour;
  }
  // if (clipBoxD == minDistance) {
  //   distColour.colour = clipBoxColour;
  // }

  return distColour;
}

// Map function for the scene
DistColour getDistanceAndColor(in vec3 p) {
  return map(p, true);
}

float getDistance(in vec3 p) {
  return map(p, false).dist;
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
    
    if (d <= MIN_DISTANCE) {
        colour = result.colour; // Set color if the surface is hit
        break;
    }

    td += d; // Move the ray forward

    // Break if we are too far away
    if (td > MAX_DISTANCE) {
      break;
    } 
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
    vec3 roOffset = p + n * 0.01; // Prevent self-shadowing
    float s = softShadow(roOffset, l, 0.1, length(lightPos - p), 8.0);

    // Adjust shadow contrast
    if (SHADOWS == 1) {
      float shadowContrast = 1.2; // Controls shadow intensity curve
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
    float ambient = 0.05; // Ambient light intensity
    float lightContribution = dif + ambient;

    // Specular highlights (Blinn-Phong model)
    vec3 viewDir = normalize(-p); // Assume camera is at the origin
    vec3 halfDir = normalize(l + viewDir); // Halfway vector
    float spec = pow(clamp(dot(n, halfDir), 0.0, 1.0), 2.0); // Specular exponent

    // Modulate specular with shadowing and attenuation
    spec *= s * attenuation * intensity;

    // Combine diffuse, ambient, and specular contributions
    lightContribution += spec * 2.4; // Scale specular for balance

    return lightContribution;
}


void main() {
  // Normalize UV coordinates to [-1, 1]
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uAspect;
  uv *= FOV_MULTIPLIER;

  // Define the ray origin (camera position)
  vec3 ro = vec3(-0.5, 1.2, 0.0);

  // Define the ray direction  
  vec3 rd = normalize(vec3(uv, 1.0));

  vec3 colour = uBgColour; // Initialize the color

  // Raymarch the scene
  float td = rayMarch(ro, rd, colour); // Total distance travelled
  vec3 p = ro + rd * td; // Intersection point

  vec3 lightPos = vec3(2.0, 2.5, 1.0);
  float lightIntensity = 10.0;
  float light = getLight(p, lightPos, lightIntensity);

  colour *= light; // Apply lighting

  // Fade out using a circle
  float fade = smoothstep(0.1, 1.3, length(vec2(uv.x - 0.5, uv.y + 0.6)));
  
  vec4 finalColour = vec4(mix(colour, uBgColour, fade), 1.0);
    
  gl_FragColor = finalColour;
}






