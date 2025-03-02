precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
uniform float scrollPos;
uniform float scrollHeight;

vec3 wave(vec2 uv) {
    float wave = sin(uv.x + iTime * 0.2) * 0.1 + 0.5;
    float dist = abs(wave - uv.y);

    if (uv.y > wave) {
        dist = smoothstep(0.0, 0.01, dist);
    }

    dist = 1.0 - dist;
    dist = clamp(dist, 0.0, 1.0);
    dist = pow(dist, 2.0);

    return vec3(dist) * 0.5;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    uv += sin(iTime) * 0.03 + 0.03;

    float x = gl_FragCoord.x / iResolution.x;
    float y = gl_FragCoord.y / iResolution.y;

    float progress = scrollPos / scrollHeight;
    progress = 1.0 - progress;

    vec3 bg = vec3(0.15, mix(0.001, 0.3, progress) + x * 0.25, mix(0.42, 0.8, progress) + x * 0.2);

    uv.y -= scrollPos * 0.001;

    vec3 waves;
    waves += wave(vec2(uv.x, uv.y)) / 1.5;
    waves += wave(vec2(uv.x * 1.5 + 8.0 + iTime * 0.1, uv.y - 0.1)) / 1.5;
    waves += wave(vec2(uv.x + 1.2, uv.y + 0.61));
    waves += wave(vec2(uv.x * 0.4 + 8.0 + iTime * 0.2, uv.y + 1.47));
    waves += wave(vec2(uv.x + 9.0 + iTime * 0.2, uv.y + 2.19));

    waves += wave(vec2(uv.x, -uv.y - 2.0)) / 2.0;
    waves += wave(vec2(uv.x + 2.0, -uv.y - 2.06));

    waves += wave(vec2(uv.x + 3.4, -uv.y - 2.9));
    waves += wave(vec2(uv.x * 0.6 + 1.2, -uv.y - 3.5));
    waves += wave(vec2(uv.x + 1.4, -uv.y - 4.0));
    waves += wave(vec2(uv.x - 0.8 * 0.4, -uv.y - 5.2));

    vec3 base = vec3(0.0588, 0.0627, 0.0784);

    gl_FragColor = vec4(waves * bg + base, 1.0) * min(iTime, 1.0);
}
