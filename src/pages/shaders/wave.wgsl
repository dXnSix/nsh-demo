// The effect's children bent sideways by a wave: `nsh.progress` moves it
// along (and in and out), `amount` is how far it bends, in points.
struct Uniforms {
  amount: f32,
}

fn main(p: vec2f, u: Uniforms) -> vec4f {
  let swell = sin(nsh.progress * 3.1416);
  let shift = sin(p.y * 0.09 + nsh.progress * 6.2832) * u.amount * swell;
  return sample_content(p + vec2f(shift, 0.0));
}
