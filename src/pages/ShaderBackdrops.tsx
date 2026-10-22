import { Shader, shaderSupport, signal, Text, View } from "nsh";
import { createAnimatedValue } from "nsh/animated";
import { Code, Note, Page, Section, Segmented } from "../ui";
import frost from "./shaders/frost.wgsl";
import lens from "./shaders/lens.wgsl";

const radii = [3, 7, 14] as const;
const zooms = [1.5, 2, 3] as const;
const words = ["glass", "lens", "pixels", "views", "WGSL", "GPU", "behind", "drag", "native", "shader", "frost", "light"];

export function ShaderBackdrops() {
  const radius = signal<(typeof radii)[number]>(7);
  const zoom = signal<(typeof zooms)[number]>(2);
  const x = createAnimatedValue(0);
  const y = createAnimatedValue(0);
  const support = shaderSupport();
  return (
    <Page
      title="Backdrops"
      intro="A shader that calls sample_backdrop(p) reads what is behind its view: the views drawn before it, under it. Its own background and children are not in it; its children draw over what it returns."
    >
      <Section title="Frosted glass" note="frost.wgsl blurs the backdrop (a Gaussian, the radius its sigma in points, as CSS's blur) and lightens it. Pick a radius.">
        <Segmented options={radii} value={radius} onChange={(v) => radius.set(v)} format={(v) => `radius ${v}`} />
        <View class="h-56 max-w-[640px] overflow-hidden rounded-2xl">
          <View class="absolute inset-0 flex-row">
            <View class="flex-1 bg-rose-500" />
            <View class="flex-1 bg-amber-400" />
            <View class="flex-1 bg-emerald-500" />
            <View class="flex-1 bg-indigo-500" />
          </View>
          <Text class="absolute left-6 top-[88px] text-4xl font-black text-zinc-900">BEHIND THE GLASS</Text>
          <Shader
            src={frost}
            uniforms={{ tint: "rgba(255,255,255,0.25)", radius: radius() }}
            class="absolute bottom-8 left-16 right-8 top-8 rounded-3xl p-4"
          >
            <Text class="text-sm font-semibold text-zinc-900">Frosted glass</Text>
          </Shader>
        </View>
        <Code>{`<Shader src={frost} uniforms={{ tint: "rgba(255,255,255,0.25)", radius: ${radius()} }} />`}</Code>
      </Section>

      <Section
        title="A lens you drag"
        note="Drag the lens over the words: lens.wgsl magnifies what is behind it. Release it and it springs back to the middle."
      >
        <Segmented options={zooms} value={zoom} onChange={(v) => zoom.set(v)} format={(v) => `zoom ${v}×`} />
        <View
          class="h-64 max-w-[640px] items-center justify-center overflow-hidden rounded-2xl bg-zinc-100"
          pan={{ x, y }}
          onPanEnd={(e) => {
            x.spring(0, { velocity: e.velocityX, stiffness: 140, damping: 12 });
            y.spring(0, { velocity: e.velocityY, stiffness: 140, damping: 12 });
          }}
        >
          <View class="absolute inset-0 flex-row flex-wrap content-center justify-center gap-2 p-4">
            {words.map((w) => (
              <View class="rounded-md bg-white px-2 py-1">
                <Text class="text-sm text-zinc-700">{w}</Text>
              </View>
            ))}
          </View>
          <Shader src={lens} uniforms={{ zoom: zoom() }} class="h-32 w-32 rounded-full" style={{ transform: [{ translateX: x }, { translateY: y }] }} />
        </View>
      </Section>

      <Note>{`shaderSupport().backdrop here: ${String(support.backdrop)} ("live": read as it is drawn; "snapshot": a picture of what is behind, taken again when it changes; false: transparent).`}</Note>
    </Page>
  );
}
