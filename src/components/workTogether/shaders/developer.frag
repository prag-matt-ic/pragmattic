// DEVELOPERS WORK TOGETHER SHADER
#pragma glslify: noise = require('glsl-noise/simplex/3d')

#define MAX_ITERATIONS 30
#define MIN_DISTANCE 0.001
#define MAX_DISTANCE 10.0
#define PI 3.141592653

uniform float uTime;
uniform bool uIsHovered;
uniform vec3 uLightColour;
uniform vec3 uDarkColour;
uniform vec3 uActiveColour;

const float FOV = 60.0;
const float FOV_MULTIPLIER = tan(PI * 0.5 * FOV / 180.0); // Convert FOV to radians

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

float sdSphere(in vec3 p, in float s) {
  return length(p) - s;
}


struct DistColour {
  float dist;
  vec3 colour;
};

// // Rotational (angular) repetition that places spheres on a ring of radius `ringRadius`.
float sdRepeatedSphereRing(in vec3 p, in int n, in float ringRadius, in float sphereRadius)
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

    return min(d1, d2);
}


DistColour getDistanceAndColor(in vec3 p) {
    vec3 sP = p - vec3(0.0, 0.0, -3.0);
    sP.yz *= rot2D(uTime * 0.2);
    sP.xy *= rot2D(uTime * 0.2);

    float t = sin(uTime * 1.2) * 0.5 + 0.5;
    // Rings of spheres
    float ringRadius = t * 1.6;
    float spheresD = sdRepeatedSphereRing(sP, 8, ringRadius, 0.3);

    // Central sphere
    float centralSphereD = sdSphere(p - vec3(0.0, 0.0, -3.), 0.6);

    DistColour result;
    result.dist = smin(centralSphereD, spheresD, 0.25);
    result.colour = mix(uIsHovered ? uActiveColour : uLightColour, uLightColour, t);

    return result;
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
    float ambient = 0.16;
    float lightContribution = dif + ambient;

    // Specular highlights (Blinn-Phong model)
    vec3 viewDir = normalize(camPos - p); // View direction 

    vec3 halfDir = normalize(l + viewDir); // Halfway vector
    float spec = pow(clamp(dot(n, halfDir), 0.0, 1.0), 2.0); // Specular exponent

    // Modulate specular with shadowing and attenuation
    spec *= attenuation * intensity;

    // Combine diffuse, ambient, and specular contributions
    lightContribution += spec * 1.4; // Scale specular for balance

    return lightContribution;
}


void main() {
    vec2 uv = vUv;
    uv *= FOV_MULTIPLIER;
    vec3 ro = vec3(0.0, 0.0, 0.0);
    vec3 rd = normalize(vec3(uv, -1.0));

    vec3 colour = uDarkColour;

    float td = rayMarch(ro, rd, colour); // Total distance travelled
    vec3 p = ro + rd * td; // Position of the hit

    float diffuse = getLight(p, ro, vec3(0.0, 2.0, -1.0), 2.0);
    colour *= diffuse;

    gl_FragColor = vec4(colour, 1.0);
}








// float repeated( vec3 p, float s )
// {
//     // Identify which cell (integer coordinates) the point p is in.
//     // 'id' is the integer grid index for this cell.
//     vec3 id = round( p / s );
    
//     // Determine the sign offset so that we check both
//     // the "lower" and "upper" neighbor in each dimension.
//     vec3 o = sign( p - s * id );

//     // Large initial value; we’ll minimize down from here.
//     float d = 1e20;

//     // Loop over the 2x2x2 region around the cell to capture 
//     // the correct repeating distance in all neighboring cells.
//     for( int k = 0; k < 2; k++ )
//     for( int j = 0; j < 2; j++ )
//     for( int i = 0; i < 2; i++ )
//     {
//         // Calculate the neighbor cell offset
//         vec3 rid = id + vec3(float(i), float(j), float(k)) * o;

//         // Get the local coordinate within that cell
//         vec3 r = p - s * rid;

//         // Evaluate the SDF in this repeated position
//         float dist = sdSphere(r, 0.4);

//         // Keep track of the minimum distance found
//         d = min( d, dist );
//     }

//     return d;
// }

// // repeat space every s units
// float tiledSphere(in vec3 p, in float s){
//     vec3 id = round(p/s);
//     vec3 r = p - (s * id);
//     return sdSphere(r, 0.25);
//     // return sdf(r, id);
// }

// float limited_repeated(in vec3 p, in vec3 size, in float s)
// {
//     // Identify which cell the point p is in
//     vec3 id = round( p / s );
    
//     // Determine offset sign to check neighboring cells
//     vec3 o = sign( p - s * id );

//     // Start with a very large distance
//     float d = 1e20;

//     // Loop over all 2×2×2 possible neighboring cells
//     for( int k = 0; k < 2; k++ )
//     for( int j = 0; j < 2; j++ )
//     for( int i = 0; i < 2; i++ )
//     {
//         // Compute which cell we are checking
//         vec3 rid = id + vec3(float(i), float(j), float(k)) * o;
        
//         // Clamp the cell index so that repetition is finite
//         // (size - 1.0) * 0.5 is half the (number of cells - 1)
//         rid = clamp( 
//             rid,
//             -(size - 1.0) * 0.5,  // minimum
//              (size - 1.0) * 0.5   // maximum
//         );

//         // Local coordinate within that cell
//         vec3 r = p - s * rid;

//         // Evaluate your 3D SDF at this repeated position
//         // Replace `sdf(r)` with whatever your 3D SDF function is
//         float dist = sdSphere(r, 0.2);

//         // Keep the minimum distance from all possibilities
//         d = min(d, dist);
//         // d = smin(d, dist, 0.1);
//     }

//     return d;
// }