  // Energy Tunnel Fragment Shader
  
  #pragma glslify: noise = require('glsl-noise/simplex/3d')

  // Number of lines is defined in the component
  // #define NUM_LINES 6

  uniform float uTime;
  // There are 8 lines. Each line has 3 parameters:
  //  - xOffset: horizontal offset
  //  - yExtension: extra vertical extension (so total height T = 1.0 + yExtension)
  //  - thickness: line thickness
  uniform float uLinesParams[NUM_LINES * 3];  

  // Each line has a colour value
  uniform vec3 uLinesColour[NUM_LINES];

  // Each line has a separate progress value in [0,1] used to control fade in/out.
  uniform float uLinesProgress[NUM_LINES];              

  // An additional manual progress control (not used in the loop below)
  uniform float uProgress;                       

  // Varying UV coordinate (passed from the vertex shader)
  varying vec2 vUv;

  void main() {
    // -------------------------------
    // BASE COLOUR INITIALIZATION
    // -------------------------------
    // Initialize the base colour to black (alpha 0)
    vec4 baseColour = vec4(0.0);
    // Final colour starts as the base colour and is built up over the loop
    vec4 finalColour = baseColour;
    
    // Precompute a horizontal variation factor since vUv.x is constant for each fragment.
    // (This is an optional micro-optimization if you want to avoid recomputing fract(vUv.x * 4.0) each iteration.)
    float uvXVariation = fract(vUv.x * 4.0);
    
    // -------------------------------
    // LOOP OVER EACH LINE
    // -------------------------------
    for (int i = 0; i < NUM_LINES; i++) {
      // Convert loop index to float for arithmetic use.
      float iF = float(i);
    
      // -------------------------------
      // FETCH PER-LINE PARAMETERS
      // -------------------------------
      float xOffset = uLinesParams[i * 4];        // Horizontal offset for this line
      float yExtension = uLinesParams[i * 4 + 1];      // Extra vertical extension (T = 1.0 + yExtension)
      float thickness = uLinesParams[i * 4 + 2] / 2.0;      // Line thickness
      // Get the colour for the current line (with a fixed alpha of 0.6)
      vec4 lineColour = vec4(uLinesColour[i], 0.4);

      // -------------------------------
      // HORIZONTAL (X) CALCULATION
      // -------------------------------
      // Compute a noise value for additional randomness in horizontal placement.
      float posNoise = noise(vec3(vUv.x + xOffset, vUv.y - uTime, iF)) * 0.5 - 0.5;
      // Compute a sine-based oscillation for further variation.
      // float posSin = sin(vUv.y / 20.0 - (iF * 0.2) + uTime) * 0.5 + 0.5;
      // Combine base UV, offset, noise, and sine contributions.
      float shiftedUV = uvXVariation + xOffset + posNoise * 0.2;
      
      // Create a horizontal mask: use smoothstep for a soft edge based on the thickness.
      // Calculate the distance from the center (0.5) and scale it so that 0 is the center and 1 is at the edge:
      float distFromCenter = abs(shiftedUV - 0.5) * 2.0;
      float horizAlpha = 1.0 - smoothstep(thickness, thickness * 2.0, distFromCenter);
      
      // Start with the horizontal alpha as the line's overall alpha.
      float lineAlpha = horizAlpha;
      
      // -------------------------------
      // VERTICAL ENVELOPE (FADE & PROGRESS)
      // -------------------------------
      // Compute the total extended height (T) for this line.
      float T = 1.0 + yExtension;
      
      // Define the fade width as a fraction of T.
      const float fadeFraction = 0.3;  // Constant fraction; can be tweaked for different fade lengths.
      float fade = fadeFraction * T;
      
      // Remap the vertical coordinate vUv.y (0–1) to an "extended" coordinate [0, T].
      float extendedY = vUv.y * T;
      
      // Determine the "flat" (fully visible) portion of the envelope.
      // For T = 1, no flat region; for T = 2, flat from 0.25 to 0.75; for T = 3, flat from ~0.167 to ~0.833.
      float visibleWidth = (T - 1.0) / T;
      float lowerThreshold = 0.5 - 0.5 * visibleWidth;
      float upperThreshold = 0.5 + 0.5 * visibleWidth;
      
      // -------------------------------
      // COMPUTE VERTICAL SHIFT (yShift)
      // -------------------------------
      // Use the per-line progress (uLinesProgress[i]) to determine where the envelope is positioned.
      // When progress is low, the envelope is shifted upward (so it fades in from below).
      // When progress is high, it is shifted downward (fading out toward the top).
      float progress = uLinesProgress[i];  // Per-line progress in [0,1]
      // float progress = uProgress;
      float yShift;
      if (progress < lowerThreshold) {
        // For progress below the flat region: interpolate from (T + fade) to 0.
        yShift = mix(T + fade, 0.0, progress / lowerThreshold);
      } else if (progress > upperThreshold) {
        // For progress above the flat region: interpolate from 0 to -(T + fade).
        yShift = mix(0.0, -(T + fade), (progress - upperThreshold) / (1.0 - upperThreshold));
      } else {
        // Within the flat region, no vertical offset.
        yShift = 0.0;
      }
      
      // -------------------------------
      // BUILD THE VERTICAL ENVELOPE
      // -------------------------------
      // The envelope is defined so that:
      //   - It rises from 0 to 1 over the interval [-fade, 0]
      //   - Is fully "on" (value 1) from 0 to T
      //   - Falls from 1 to 0 over the interval [T, T+fade]
      // The envelope is computed on the shifted vertical coordinate (extendedY - yShift).
      float envelopeAlpha = smoothstep(-fade, 0.0, extendedY - yShift) *
                            (1.0 - smoothstep(T, T + fade, extendedY - yShift));
      
      // Multiply the horizontal alpha by the vertical envelope.
      lineAlpha *= envelopeAlpha;
      
      // -------------------------------
      // COMBINE WITH FINAL COLOUR
      // -------------------------------
      // Mix the current line’s colour over the accumulated final colour using the computed lineAlpha.
      finalColour = mix(finalColour, lineColour, lineAlpha);
    }

    // -------------------------------
    // GLOBAL VERTICAL FADE
    // -------------------------------
    // Apply an additional fade at the top and bottom of the screen.
    // This fades out fragments near the edges (vUv.y near 0 or 1).
    finalColour.a *= 1.0 - smoothstep(0.2, 1.0, abs(vUv.y - 0.5) * 2.0);
    
    gl_FragColor = finalColour;
  }
