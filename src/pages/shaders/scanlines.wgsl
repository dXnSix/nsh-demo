// An old monitor: dark lines every `gap` points, colors split sideways.
struct Uniforms {
  gap: f32,
}

fn main(p: vec2f, u: Uniforms) -> vec4f {
  let r = sample_content(p + vec2f(1.0, 0.0)).r;
  let g = sample_content(p).g;
  let b = sample_content(p - vec2f(1.0, 0.0)).b;
  let a = sample_content(p).a;
  let line = 0.75 + 0.25 * cos(p.y / u.gap * 6.2831853);
  return vec4f(vec3f(r, g, b) * line, a);
}
