precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
uniform float scrollPos;
uniform float scrollHeight;

vec3 bg(vec2 uv) {
    uv = vec2(uv.x * 0.484 + 82.0 + iTime * 0.2, uv.y + 5.1);

    float wave = sin(uv.x + iTime * 0.2) * 0.1;
    float dist = abs(uv.y - wave);

    if (uv.y > wave) {
        dist = smoothstep(0.0, 0.025 + abs(uv.x) * 0.1, dist);
    } else {
        dist = dist * 0.2;
    }

    return vec3(1.0 - dist);
}

vec3 wave(vec2 uv) {
    float wave = sin(uv.x + iTime * 0.2) * 0.1;
    float dist = abs(uv.y - wave);

    if (uv.y > wave) {
        dist = smoothstep(0.0, 0.025, dist);
    } else {
        dist = dist * 0.2;
    }

    return vec3(1.0 - dist);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    uv += sin(iTime) * 0.03 + 0.03;
    uv.y -= scrollPos * 0.001;

    vec3 waves = vec3(bg(uv));
    waves = max(waves, wave(vec2(uv.x, uv.y - 0.1)));
    waves = max(waves, wave(vec2(uv.x + 1.2, uv.y + 0.61)));
    waves = max(waves, wave(vec2(uv.x * 0.4 + 8.0 + iTime * 0.2, uv.y + 1.47)));
    waves = max(waves, wave(vec2(uv.x + 9.0 + iTime * 0.2, uv.y + 2.19)));
    waves = max(waves, wave(vec2(uv.x, uv.y + 3.19)));
    waves = max(waves, wave(vec2(uv.x * 0.4, uv.y + 4.12)));
    waves = max(waves, wave(vec2(uv.x * 0.484 + 82.0 + iTime * 0.2, uv.y + 5.1)));
    waves = max(waves, wave(vec2(uv.x * 0.7 + 9.0 + iTime * 0.2, uv.y + 6.0)));
    waves = max(waves, wave(vec2(uv.x * 0.4 + 2.2, uv.y + 7.4)));

    float x = gl_FragCoord.x / iResolution.x;
    float y = gl_FragCoord.y / iResolution.y;
    float progress = 1.0 - (scrollPos / scrollHeight);

    vec3 bg = vec3(0.15, mix(0.001, 0.3, progress) + x * 0.25, mix(0.42, 0.8, progress) + x * 0.2);
    vec3 base = vec3(0.0588, 0.0627, 0.0784);

    gl_FragColor = vec4(waves * bg + base, 1.0) * min(iTime, 1.0);
}
