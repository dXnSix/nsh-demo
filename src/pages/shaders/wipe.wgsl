// A soft wipe from left to right, `angle` radians off vertical.
struct Uniforms {
  angle: f32,
  soft: f32,
}

fn main(p: vec2f, u: Uniforms) -> vec4f {
  let d = vec2f(cos(u.angle), sin(u.angle));
  let span = abs(d.x) * nsh.size.x + abs(d.y) * nsh.size.y;
  let along = dot(p, d) - min(0.0, d.x) * nsh.size.x - min(0.0, d.y) * nsh.size.y;
  let edge = nsh.progress * (span + 2.0 * u.soft) - u.soft;
  let t = smoothstep(edge - u.soft, edge + u.soft, along);
  return mix(sample_to(p), sample_from(p), t);
}
