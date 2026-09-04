/* https://github.com/paper-design/shaders/blob/main/packages/shaders/src/shaders/image-dithering.ts */

/**
 * A dithering image filter with support for 4 dithering modes and multiple color palettes
 * (2-color, 3-color, and multicolor options, using either predefined colors or colors sampled
 * from the original image).
 *
 * SIZING NOTE: This shader performs sizing in the fragment shader (not vertex shader) to keep
 * u_pxSize in consistent actual pixels. The pixel grid is computed from gl_FragCoord before any
 * transforms, so scaling/rotating only affects the underlying image.
 * No vertex shader outputs (v_imageUV, v_objectUV, etc.) are used.
 *
 * Fragment shader uniforms:
 * - u_resolution (vec2): Canvas resolution in pixels
 * - u_pixelRatio (float): Device pixel ratio
 * - u_image (sampler2D): Source image texture
 * - u_inverted (bool): Inverts the image luminance, doesn't affect the color scheme
 * - u_type (float): Dithering type (1 = random, 2 = 2x2 Bayer, 3 = 4x4 Bayer, 4 = 8x8 Bayer)
 * - u_pxSize (float): Pixel size of dithering grid (0.5 to 20)
 * - u_colorSteps (float): Number of colors to use, applies to both color modes (1 to 7)
 *
 */

/*
 * Removed:
 * - u_imageAspectRatio (float): Aspect ratio of the source image
 * - u_originX (float): Reference point for positioning world width in the canvas (0 to 1)
 * - u_originY (float): Reference point for positioning world height in the canvas (0 to 1)
 * - u_fit (float): How to fit the rendered shader into the canvas dimensions (0 = none, 1 = contain, 2 = cover)
 * - u_scale (float): Overall zoom level of the graphics (0.1 to 4)
 * - u_rotation (float): Overall rotation angle of the graphics in degrees (0 to 360)
 * - u_offsetX (float): Horizontal offset of the graphics center (-1 to 1)
 * - u_offsetY (float): Vertical offset of the graphics center (-1 to 1)
 * - u_colorFront (vec4): Foreground color in RGBA, needs originalColors off
 * - u_colorBack (vec4): Background color in RGBA, needs originalColors off
 * - u_colorHighlight (vec4): Secondary foreground color in RGBA (set same as colorFront for classic 2-color dithering), needs originalColors off
 * - u_originalColors (bool): Use the original colors of the image instead of the color palette
 */

// language=GLSL
export const imageDitheringFragmentShader: string = `#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_pixelRatio;

uniform sampler2D u_image;

uniform float u_type;
uniform float u_pxSize;
uniform bool u_inverted;
uniform float u_colorSteps;

out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

#define PI 3.14159265358979323846

const int bayer2x2[4] = int[4](0, 2, 3, 1);
const int bayer4x4[16] = int[16](
0, 8, 2, 10,
12, 4, 14, 6,
3, 11, 1, 9,
15, 7, 13, 5
);

const int bayer8x8[64] = int[64](
0, 32, 8, 40, 2, 34, 10, 42,
48, 16, 56, 24, 50, 18, 58, 26,
12, 44, 4, 36, 14, 46, 6, 38,
60, 28, 52, 20, 62, 30, 54, 22,
3, 35, 11, 43, 1, 33, 9, 41,
51, 19, 59, 27, 49, 17, 57, 25,
15, 47, 7, 39, 13, 45, 5, 37,
63, 31, 55, 23, 61, 29, 53, 21
);

float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(fract(uv / float(size)) * float(size));
  int index = pos.y * size + pos.x;

  if (size == 2) {
    return float(bayer2x2[index]) / 4.0;
  } else if (size == 4) {
    return float(bayer4x4[index]) / 16.0;
  } else if (size == 8) {
    return float(bayer8x8[index]) / 64.0;
  }
  return 0.0;
}

void main() {
  float pxSize = u_pxSize * u_pixelRatio;
  vec2 pxSizeUV = gl_FragCoord.xy - .5 * u_resolution;
  pxSizeUV /= pxSize;
  vec2 canvasPixelizedUV = (floor(pxSizeUV) + .5) * pxSize;
  vec2 normalizedUV = canvasPixelizedUV / u_resolution;

  vec2 imageUV = normalizedUV + 0.5;
  vec2 ditheringNoiseUV = canvasPixelizedUV;
  vec4 image = texture(u_image, imageUV);

  int type = int(floor(u_type));
  float dithering = 0.0;

  float lum = dot(vec3(.2126, .7152, .0722), image.rgb);
  lum = u_inverted ? (1. - lum) : lum;

  switch (type) {
    case 1: {
      dithering = step(hash21(ditheringNoiseUV), lum);
    } break;
    case 2:
    dithering = getBayerValue(pxSizeUV, 2);
    break;
    case 3:
    dithering = getBayerValue(pxSizeUV, 4);
    break;
    default:
    dithering = getBayerValue(pxSizeUV, 8);
    break;
  }

  float colorSteps = max(floor(u_colorSteps), 1.);
  vec3 color = vec3(0.0);
  float opacity = 1.;

  dithering -= .5;
  float brightness = clamp(lum + dithering / colorSteps, 0.0, 1.0);
  brightness = mix(0.0, brightness, image.a);
  float quantLum = floor(brightness * colorSteps + 0.5) / colorSteps;

  vec3 normColor = image.rgb / max(lum, 0.001);
  color = normColor * quantLum;

  float quantAlpha = floor(image.a * colorSteps + 0.5) / colorSteps;
  opacity = mix(quantLum, 1., quantAlpha);

  fragColor = vec4(color, opacity);
}`;
