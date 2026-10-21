// A light on a grid: `offset` moves it from the middle (dragged), `radius`
// and `color` size and tint it (springs and timings on the UI thread).
struct Uniforms {
  color: vec4f,
  offset: vec2f,
  radius: f32,
}

fn main(p: vec2f, u: Uniforms) -> vec4f {
  let d = length(p - (nsh.size * 0.5 + u.offset));
  let core = 1.0 - smoothstep(u.radius * 0.55, u.radius, d);
  let halo = exp(-max(d - u.radius * 0.55, 0.0) / (u.radius * 0.7)) * 0.5;
  let line = max(step(0.95, fract(p.x / 20.0)), step(0.95, fract(p.y / 20.0)));
  let ground = vec4f(vec3f(0.05 + 0.06 * line), 1.0);
  let light = u.color * clamp(core + halo, 0.0, 1.0);
  return light + ground * (1.0 - light.a);
}
