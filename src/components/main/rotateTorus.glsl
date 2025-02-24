#pragma glslify: rotation3dZ = require(glsl-rotate/rotation-3d-z)
#pragma glslify: rotation3dY = require(glsl-rotate/rotation-3d-y)
#pragma glslify: rotation3dX = require(glsl-rotate/rotation-3d-x)


vec3 rotateTorus(inout vec3 position, in float angle) {
    position *= rotation3dZ(-angle * 2.0);
    position *= rotation3dY(angle * 4.0);
    position *= rotation3dX(-angle);
    return position;
}

#pragma glslify: export(rotateTorus)