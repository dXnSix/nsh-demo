// The old side breaks into blocks that grow to `most` points at the middle
// of the transition, and the new side forms from them.
struct Uniforms {
  most: f32,
}

fn main(p: vec2f, u: Uniforms) -> vec4f {
  let k = 1.0 - abs(nsh.progress * 2.0 - 1.0);
  let block = max(1.0, u.most * k);
  let q = (floor(p / block) + 0.5) * block;
  return mix(sample_from(q), sample_to(q), smoothstep(0.35, 0.65, nsh.progress));
}
