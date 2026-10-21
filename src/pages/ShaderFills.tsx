import { Shader, signal, Text, View } from "nsh";
import { Code, Note, Page, Section, Segmented } from "../ui";
import aurora from "./shaders/aurora.wgsl";
import noise from "./shaders/noise.wgsl";

const speeds = [0.25, 0.8, 2] as const;
const palettes = {
  ocean: { low: "#0c2a4a", high: "#7dd3fc" },
  ember: { low: "#3b0a0a", high: "#fbbf24" },
  moss: { low: "#0f2a1d", high: "#a7f3d0" },
} as const;
const scales = [24, 60, 140] as const;

export function ShaderFills() {
  const speed = signal<(typeof speeds)[number]>(0.8);
  const palette = signal<keyof typeof palettes>("ocean");
  const scale = signal<(typeof scales)[number]>(60);
  const seed = signal(3);
  return (
    <Page
      title="Shader fills"
      intro="<Shader src uniforms> is a view the GPU fills with a shader written in WGSL: fn main(p: vec2f, u: Uniforms) -> vec4f returns each pixel's color, p in points from the view's top-left corner. Its children draw over the shader, and its styles (corners, borders, shadows) apply as on any view. A shader that reads nsh.time draws every frame while it is on screen; one that does not draws only when its uniforms or its size change."
    >
      <Section
        title="An animated fill: nsh.time"
        note="aurora.wgsl moves three bands of light with nsh.time. The text and the button are the view's children."
      >
        <Segmented options={speeds} value={speed} onChange={(v) => speed.set(v)} format={(v) => `speed ${v}`} />
        <Shader
          src={aurora}
          uniforms={{ top: "#0b1026", bottom: "#1c2a4a", band: "#5ce1b0", speed: speed() }}
          class="h-56 max-w-[640px] justify-end gap-2 rounded-2xl p-5"
        >
          <Text class="text-2xl font-bold text-white">Northern lights</Text>
          <Text class="text-sm text-white/70">Children draw over the shader.</Text>
          <View class="self-start rounded-md bg-white/15 px-3 py-1.5 active:bg-white/25" onPress={() => speed.set(speed() === 2 ? 0.25 : 2)}>
            <Text class="text-xs font-medium text-white">Tap to change the speed</Text>
          </View>
        </Shader>
        <Code>{`uniforms={{ top: "#0b1026", bottom: "#1c2a4a", band: "#5ce1b0", speed: ${speed()} }}`}</Code>
      </Section>

      <Section
        title="A gradient of noise"
        note="noise.wgsl warps fractal noise and maps it between two colors. It reads no nsh.time, so it draws once, then again only when you pick another palette, scale or seed."
      >
        <View class="flex flex-row flex-wrap gap-4">
          <Segmented options={Object.keys(palettes) as (keyof typeof palettes)[]} value={palette} onChange={(v) => palette.set(v)} />
          <Segmented options={scales} value={scale} onChange={(v) => scale.set(v)} format={(v) => `scale ${v}`} />
          <View class="rounded-md border border-zinc-300 bg-white px-3 py-1.5 active:bg-zinc-100" onPress={() => seed.set(seed() + 1)}>
            <Text class="text-xs font-medium text-zinc-700">New seed ({seed()})</Text>
          </View>
        </View>
        <Shader
          src={noise}
          uniforms={{ ...palettes[palette()], scale: scale(), seed: seed() }}
          class="h-48 max-w-[640px] rounded-2xl"
        />
        <Note>Colors are CSS colors; the shader gets them premultiplied, as every color it returns is.</Note>
      </Section>

      <Section
        title="A shader view is a view"
        note="Rounded corners clip the fill, the border and the shadow draw as on any view, and the children lay out with flex as usual."
      >
        <View class="flex flex-row flex-wrap gap-6">
          <Shader
            src={noise}
            uniforms={{ ...palettes.ember, scale: 40, seed: 7 }}
            class="size-32 items-center justify-center rounded-full border-4 border-white shadow-xl"
          >
            <Text class="text-lg font-bold text-white">rounded-full</Text>
          </Shader>
          <Shader
            src={noise}
            uniforms={{ ...palettes.moss, scale: 30, seed: 2 }}
            class="h-32 w-56 flex-row items-end justify-between rounded-xl p-3 opacity-90"
          >
            <Text class="text-sm font-semibold text-white">opacity-90</Text>
            <Text class="text-xs text-white/80">flex-row, p-3</Text>
          </Shader>
          <Shader src={aurora} uniforms={{ top: "#111827", bottom: "#4c1d95", band: "#f0abfc", speed: 1.4 }} class="h-32 w-32 rotate-6 rounded-3xl" />
        </View>
      </Section>
    </Page>
  );
}
