// The effect's children in blocks of `block` points: each block shows the
// content at its middle.
struct Uniforms {
  block: f32,
}

fn main(p: vec2f, u: Uniforms) -> vec4f {
  let q = (floor(p / u.block) + 0.5) * u.block;
  return sample_content(q);
}
