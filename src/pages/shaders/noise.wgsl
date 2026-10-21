// Domain-warped noise between two colors. It reads no `nsh.time`: it draws
// only when its uniforms or its size change.
struct Uniforms {
  low: vec4f,
  high: vec4f,
  scale: f32,
  seed: f32,
}

fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let s = f * f * (3.0 - 2.0 * f);
  let a = hash(i);
  let b = hash(i + vec2f(1.0, 0.0));
  let c = hash(i + vec2f(0.0, 1.0));
  let d = hash(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, s.x), mix(c, d, s.x), s.y);
}

fn fbm(p: vec2f) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var q = p;
  for (var i = 0; i < 5; i++) {
    value += amplitude * noise(q);
    q = q * 2.03 + vec2f(1.7, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

fn main(p: vec2f, u: Uniforms) -> vec4f {
  let q = p / u.scale + vec2f(u.seed, u.seed * 0.37);
  let warp = vec2f(fbm(q), fbm(q + vec2f(5.2, 1.3)));
  let n = fbm(q + 4.0 * warp);
  return mix(u.low, u.high, smoothstep(0.25, 0.75, n));
}
