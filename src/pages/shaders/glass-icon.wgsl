// A glass icon in the style of react-bits' GlassIcons: a colored tile,
// tilted, behind a frosted glass tile. The shader draws both, so the glass
// blurs and bends the tile it draws itself. `lift` (0 to 1, an animated
// value) tilts the back tile further and raises the glass.
struct Uniforms {
  tint: vec4f,
  shade: vec4f,
  lift: f32,
}

// The distance to a rounded square of half size `half` (negative inside).
fn box(p: vec2f, half: f32, radius: f32) -> f32 {
  let q = abs(p) - vec2f(half - radius);
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
}

fn turn(p: vec2f, degrees: f32) -> vec2f {
  let a = radians(degrees);
  return vec2f(cos(a) * p.x + sin(a) * p.y, cos(a) * p.y - sin(a) * p.x);
}

// The back tile at `p`, premultiplied.
fn back(p: vec2f, u: Uniforms) -> vec4f {
  let side = min(nsh.size.x, nsh.size.y) * 0.6;
  let center = nsh.size * 0.5 - vec2f(side * (0.1 + 0.06 * u.lift));
  let q = turn(p - center, 15.0 + 10.0 * u.lift);
  let d = box(q, side * 0.5, side * 0.24);
  let t = clamp((q.x + q.y) / (2.0 * side) + 0.5, 0.0, 1.0);
  return mix(u.tint, u.shade, t) * clamp(0.5 - d, 0.0, 1.0);
}

fn main(p: vec2f, u: Uniforms) -> vec4f {
  let behind = back(p, u);
  let side = min(nsh.size.x, nsh.size.y) * 0.6;
  let center = nsh.size * 0.5 + vec2f(side * 0.08, side * (0.08 - 0.12 * u.lift));
  let d = box(p - center, side * 0.5, side * 0.24);
  let inside = clamp(0.5 - d, 0.0, 1.0);
  if (inside <= 0.0) {
    return behind;
  }
  // Frosted: the back tile averaged around each point, bent toward the
  // glass's middle near its edges.
  let bend = (p - center) * 0.12 * smoothstep(-side * 0.25, 0.0, d);
  var frosted = vec4f(0.0);
  for (var i = 0; i < 16; i++) {
    let a = f32(i) * 0.3927;
    let r = side * (0.03 + 0.05 * f32(i % 4) / 3.0);
    frosted += back(p - bend + vec2f(cos(a), sin(a)) * r, u);
  }
  frosted = frosted / 16.0;
  // A white veil, a brighter rim and a sheen from the top left.
  let rim = smoothstep(-2.0, 0.0, d) * 0.5;
  let sheen = 0.16 * smoothstep(side * 0.5, -side * 0.5, (p.y - center.y) + 0.5 * (p.x - center.x));
  let veil = min(0.16 + rim + sheen, 1.0);
  let glass = vec4f(veil) + frosted * (1.0 - veil);
  return mix(behind, glass, inside);
}
