import { ShaderEffect, shaderSupport, signal, Text, View } from "nsh";
import { createAnimatedValue, Easing } from "nsh/animated";
import { Code, Note, Page, Section, Segmented } from "../ui";
import pixelate from "./shaders/pixelate.wgsl";
import wave from "./shaders/wave.wgsl";

const offsets = [0, 16] as const;
const blocks = [1, 4, 10] as const;

export function ShaderEffects() {
  const progress = createAnimatedValue(0);
  const presses = signal(0);
  const offset = signal<(typeof offsets)[number]>(16);
  const block = signal<(typeof blocks)[number]>(4);
  const bend = () => {
    progress.set(0);
    progress.timing(1, { duration: 1800, easing: Easing.inOut(Easing.quad) });
  };
  const support = shaderSupport();
  return (
    <Page
      title="Shader effects"
      intro="<ShaderEffect src uniforms> draws its children through a shader: sample_content(p) reads what they draw, and what the shader returns is what shows. The children stay views: they lay out, take presses and update as usual. nsh.progress is the effect's progress prop, a number or an animated value."
    >
      <Section
        title="Children through a shader"
        note="Tap Bend: a timing moves progress, and wave.wgsl bends the card sideways. The button inside the card keeps its presses."
      >
        <View class="flex-row items-center gap-3">
          <View class="rounded-md border border-zinc-300 bg-white px-3 py-1.5 active:bg-zinc-100" onPress={bend}>
            <Text class="text-xs font-medium text-zinc-700">Bend</Text>
          </View>
        </View>
        <View class="max-w-[640px] py-2">
          <ShaderEffect src={wave} uniforms={{ amount: 12 }} progress={progress} maxSampleOffset={16}>
            <View class="gap-3 rounded-2xl bg-sky-500 p-5">
              <Text class="text-2xl font-bold text-white">Through a shader</Text>
              <Text class="text-sm text-white/80">Text, views and their presses, bent by the GPU</Text>
              <View class="self-start rounded-md bg-white px-3 py-1.5 active:bg-zinc-100" onPress={() => presses.set(presses() + 1)}>
                <Text class="text-xs font-medium text-zinc-800">{`Pressed ${presses()}×`}</Text>
              </View>
            </View>
          </ShaderEffect>
        </View>
        <Code>{`<ShaderEffect src={wave} uniforms={{ amount: 12 }} progress={progress} maxSampleOffset={16}>`}</Code>
      </Section>

      <Section
        title="Beyond the bounds: maxSampleOffset"
        note="The effect draws its view and maxSampleOffset points around it. With 0 the wave is cut at the card's edges; with 16 it bends out of them."
      >
        <Segmented options={offsets} value={offset} onChange={(v) => offset.set(v)} format={(v) => `maxSampleOffset ${v}`} />
        <View class="max-w-[640px] py-4">
          <ShaderEffect src={wave} uniforms={{ amount: 14 }} progress={0.5} maxSampleOffset={offset()}>
            <View class="h-28 justify-center rounded-2xl bg-violet-500 px-5">
              <Text class="text-lg font-semibold text-white">progress 0.5: the wave at its widest</Text>
            </View>
          </ShaderEffect>
        </View>
      </Section>

      <Section title="Pixelate" note="pixelate.wgsl shows each block of the children's drawing as the color at its middle.">
        <Segmented options={blocks} value={block} onChange={(v) => block.set(v)} format={(v) => `${v}pt blocks`} />
        <ShaderEffect src={pixelate} uniforms={{ block: block() }}>
          <View class="max-w-[640px] gap-3 rounded-2xl bg-gradient-to-r from-amber-300 via-rose-400 to-indigo-500 p-5">
            <Text class="text-3xl font-black text-white">Blocks of color</Text>
            <View class="flex-row gap-2">
              <View class="h-10 w-10 rounded-full bg-white" />
              <View class="h-10 w-10 rounded-full bg-zinc-900" />
              <View class="h-10 w-10 rounded-full bg-emerald-400" />
            </View>
          </View>
        </ShaderEffect>
      </Section>

      <Note>{`shaderSupport().effect here: ${String(support.effect)} ("live": drawn with the children; "snapshot": a picture of them, taken again when they change; false: the children as they are).`}</Note>
    </Page>
  );
}
