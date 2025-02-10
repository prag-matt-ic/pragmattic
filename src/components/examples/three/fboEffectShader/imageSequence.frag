// Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')
#pragma glslify: blur = require('glsl-fast-gaussian-blur/13')

// Uniforms received from the JavaScript
uniform float uAspectRatio;
uniform sampler2D uTexture;
uniform float uTextureAspect;

// Varyings received from the vertex shader
varying vec2 vUv;


vec4 getImageColorCover (in sampler2D image, in vec2 uv) {
  vec2 scaleX = vec2(uAspectRatio / uTextureAspect, 1.0);
  vec2 offsetX = vec2((1.0 - scaleX.x) / 2.0, 0.0);
  vec2 scaleY = vec2(1.0, uTextureAspect / uAspectRatio);
  vec2 offsetY = vec2(0.0, (1.0 - scaleY.y) / 2.0);
  float conditionX = step(uAspectRatio, uTextureAspect); // 1.0 if uAspectRatio <= uTextureAspect, 0.0 otherwise
  float conditionY = 1.0 - conditionX; // 1.0 if uAspectRatio > uTextureAspect, 0.0 otherwise
  vec2 scale = mix(scaleY, scaleX, conditionX);
  vec2 offset = mix(offsetY, offsetX, conditionX);
  vec2 uvAdjusted = uv * scale + offset;
  // Clamp the UV coordinates to avoid sampling outside the texture bounds
  uvAdjusted = clamp(uvAdjusted, vec2(0.0), vec2(1.0));
  vec4 color = texture2D(image, uvAdjusted);
  return color;
}

void main() {
  vec2 textureUv = vUv;
  vec4 imageColour = getImageColorCover(uTexture, vUv);
  gl_FragColor = imageColour;
}

