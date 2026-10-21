// A glass card over a scene the shader draws: colored lights drifting on a
// dark ground (`nsh.time`). The card frosts and bends the scene behind it;
// `offset` moves it from the middle (dragged: two animated values).
struct Uniforms {
  offset: vec2f,
  card: vec2f,
  radius: f32,
}

fn scene(p: vec2f) -> vec3f {
  let t = nsh.time * 0.5;
  let r = min(nsh.size.x, nsh.size.y) * 0.3;
  let a = nsh.size * vec2f(0.3 + 0.12 * sin(t), 0.4 + 0.15 * cos(t * 1.3));
  let b = nsh.size * vec2f(0.7 + 0.1 * cos(t * 0.8), 0.6 + 0.12 * sin(t * 1.1));
  let c = nsh.size * vec2f(0.5 + 0.2 * sin(t * 0.6 + 2.0), 0.25 + 0.1 * cos(t * 0.9));
  var color = vec3f(0.05, 0.06, 0.09);
  color += vec3f(0.98, 0.35, 0.55) * exp(-pow(length(p - a) / r, 2.0));
  color += vec3f(0.25, 0.55, 1.0) * exp(-pow(length(p - b) / r, 2.0));
  color += vec3f(1.0, 0.8, 0.25) * exp(-pow(length(p - c) / (r * 0.8), 2.0));
  // Fine stripes, so the bending shows.
  color += vec3f(0.05 * step(0.5, fract((p.x + p.y) / 14.0)));
  return min(color, vec3f(1.0));
}

fn box(p: vec2f, half: vec2f, radius: f32) -> f32 {
  let q = abs(p) - half + vec2f(radius);
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
}

fn main(p: vec2f, u: Uniforms) -> vec4f {
  let center = nsh.size * 0.5 + u.offset;
  let d = box(p - center, u.card * 0.5, u.radius);
  let inside = clamp(0.5 - d, 0.0, 1.0);
  // A soft shadow under the card.
  let shadow = 0.4 * (1.0 - smoothstep(-6.0, 22.0, box(p - center - vec2f(0.0, 8.0), u.card * 0.5, u.radius)));
  let ground = vec4f(scene(p) * (1.0 - shadow), 1.0);
  if (inside <= 0.0) {
    return ground;
  }
  let edge = smoothstep(-16.0, 0.0, d);
  let bend = normalize(p - center + vec2f(0.001)) * edge * edge * 12.0;
  var frosted = vec3f(0.0);
  for (var i = 0; i < 12; i++) {
    let a = f32(i) * 0.5236;
    frosted += scene(p - bend + vec2f(cos(a), sin(a)) * 8.0);
  }
  frosted = frosted / 12.0;
  let rim = smoothstep(-1.5, 0.0, d) * 0.45;
  let glass = vec4f(min(frosted * 0.8 + vec3f(0.14 + rim), vec3f(1.0)), 1.0);
  return mix(ground, glass, inside);
}
