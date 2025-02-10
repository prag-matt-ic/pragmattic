// Fragment shader

// Uniforms received from the JavaScript
uniform float uTime;
uniform float uAspectRatio;
uniform sampler2D uTextureColour;

// Varyings received from the vertex shader
varying vec2 vUv;

// Convert linear RGB color to sRGB color - to make the image look as it should
vec4 linearToSRGB(in vec4 value) {
    vec3 linearRGB = value.rgb;
    vec3 sRGB = mix(
        pow(linearRGB, vec3(1.0 / 2.4)) * 1.055 - vec3(0.055),
        linearRGB * 12.92,
        vec3(lessThanEqual(linearRGB, vec3(0.0031308)))
    );
    return vec4(sRGB, value.a);
}


void main() {

  vec2 textureUv = vUv;
  // Adjust for aspect ratio
  textureUv.x *= uAspectRatio;
  textureUv.x -= uTime * 0.04;

  textureUv = fract(textureUv);
  vec4 textureColour = texture2D(uTextureColour, textureUv);
  textureColour = linearToSRGB(textureColour);

  gl_FragColor = textureColour;
}