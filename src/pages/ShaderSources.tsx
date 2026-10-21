import { computed, createShader, Input, Shader, shaderSupport, signal, Text, View } from "nsh";
import { Code, Note, Page, Section, Segmented } from "../ui";
import noise from "./shaders/noise.wgsl";
import spotlight from "./shaders/spotlight.wgsl";

const presets = {
  stripes: `fn main(p: vec2f) -> vec4f {
  let on = step(0.5, fract((p.x + p.y) / 24.0));
  return mix(vec4f(0.05, 0.35, 0.75, 1.0), vec4f(0.85, 0.93, 1.0, 1.0), on);
}`,
  rings: `fn main(p: vec2f) -> vec4f {
  let d = length(p - nsh.size * 0.5);
  let r = 0.5 + 0.5 * cos(d * 0.25 - nsh.time * 3.0);
  return vec4f(vec3f(0.95, 0.4, 0.3) * r, 1.0);
}`,
  checker: `fn main(p: vec2f) -> vec4f {
  let cell = floor(p / 16.0);
  let odd = (i32(cell.x) + i32(cell.y)) % 2 == 1;
  return select(vec4f(0.9, 0.9, 0.92, 1.0), vec4f(0.12, 0.12, 0.14, 1.0), odd);
}`,
  plasma: `fn main(p: vec2f) -> vec4f {
  let q = p / 40.0;
  let t = nsh.time;
  let v = sin(q.x + t) + sin(q.y * 1.3 - t) + sin((q.x + q.y) * 0.7 + t * 0.5);
  let c = 0.5 + 0.5 * cos(vec3f(0.0, 2.1, 4.2) + v);
  return vec4f(c, 1.0);
}`,
  broken: `fn main(p: vec2f) -> vec4f {
  // A while loop is not in NSH's WGSL: loops are counted for loops.
  var i = 0;
  while (i < 4) { i++; }
  return vec4f(1.0);
}`,
} as const;

type Preset = keyof typeof presets;

export function ShaderSources() {
  const preset = signal<Preset>("rings");
  const source = signal<string>(presets.rings);
  // createShader checks the source in Rust: a shader, or the error with its
  // line and column. The same source is the same shader.
  const made = computed(() => {
    try {
      return { shader: createShader(source()), error: null };
    } catch (e) {
      return { shader: null, error: `${(e as Error).name}: ${(e as Error).message}` };
    }
  });
  const support = shaderSupport();
  return (
    <Page
      title="WGSL sources"
      intro="A shader comes from a .wgsl file the app imports, checked when the app builds, or from createShader(source) at run time, which throws a SyntaxError naming the line and column of what NSH's WGSL does not take. .nsh/types declares each .wgsl file's uniforms, so the type checker knows the names and the values each takes."
    >
      <Section
        title="import noise from './shaders/noise.wgsl'"
        note="The default export is the shader; uniforms lists its uniforms' names in the struct's order."
      >
        <Code>{`noise.uniforms = [${noise.uniforms.map((n) => `"${n}"`).join(", ")}]`}</Code>
        <Code>{`spotlight.uniforms = [${spotlight.uniforms.map((n) => `"${n}"`).join(", ")}]`}</Code>
        <Note>
          {".nsh/types/app/src/pages/shaders/noise.d.wgsl.ts declares a ShaderAsset of { low?, high?: colors or vec4s; scale?, seed?: numbers or animated values }: a wrong uniform value is a type error."}
        </Note>
      </Section>

      <Section
        title="createShader(source)"
        note="Edit the source: every change makes a shader again. Pick broken to see an error."
      >
        <Segmented
          options={Object.keys(presets) as Preset[]}
          value={preset}
          onChange={(v) => {
            preset.set(v);
            source.set(presets[v]);
          }}
        />
        <View class="max-w-[960px] flex-row flex-wrap gap-4">
          <Input
            multiline
            autoCorrect={false}
            autoCapitalize="none"
            value={source()}
            onChange={(text) => source.set(text)}
            class="min-h-56 min-w-[320px] flex-1 rounded-xl border border-zinc-300 bg-zinc-50 p-3 font-mono text-xs text-zinc-900"
          />
          <View class="min-w-[240px] flex-1 gap-2">
            {made().shader ? (
              <Shader src={made().shader!} class="h-56 rounded-xl border border-zinc-200" />
            ) : (
              <View class="h-56 items-center justify-center rounded-xl border border-dashed border-rose-300 bg-rose-50">
                <Text class="text-xs text-rose-700">No shader</Text>
              </View>
            )}
          </View>
        </View>
        {made().error ? (
          <View class="max-w-[960px] rounded-lg bg-rose-50 p-3">
            <Text class="font-mono text-xs text-rose-800">{made().error!}</Text>
          </View>
        ) : (
          <Note>The shader compiled: NSH translated it for this platform's GPU.</Note>
        )}
      </Section>

      <Section title="shaderSupport()" note="What this platform draws: live, from a snapshot, or false (the view shows its children).">
        <View class="flex-row flex-wrap gap-2">
          <Code>{`fill: ${String(support.fill)}`}</Code>
          <Code>{`backdrop: ${String(support.backdrop)}`}</Code>
          <Code>{`effect: ${String(support.effect)}`}</Code>
          <Code>{`transition: ${String(support.transition)}`}</Code>
        </View>
      </Section>
    </Page>
  );
}
