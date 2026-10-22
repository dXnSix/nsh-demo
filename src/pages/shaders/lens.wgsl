// A round lens: what is behind it, magnified `zoom` times in its middle
// and less toward its rim, which is lightened.
struct Uniforms {
  zoom: f32,
}

fn main(p: vec2f, u: Uniforms) -> vec4f {
  let c = nsh.size * 0.5;
  let r = min(c.x, c.y);
  let d = p - c;
  let k = length(d) / r;
  let bend = mix(1.0 / u.zoom, 1.0, k * k);
  let back = sample_backdrop(c + d * bend);
  let rim = smoothstep(0.82, 1.0, k) * 0.4;
  let inside = 1.0 - smoothstep(0.97, 1.0, k);
  return (back * (1.0 - rim) + vec4f(rim)) * inside;
}
