// The whole screen in blocks of `size` points.
struct Uniforms {
  size: f32,
}

fn main(p: vec2f, u: Uniforms) -> vec4f {
  let s = max(u.size, 1.0);
  return sample_content((floor(p / s) + 0.5) * s);
}
