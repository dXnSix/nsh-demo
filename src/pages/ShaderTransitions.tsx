import { ShaderTransition, shaderSupport, signal, Text, View } from "nsh";
import { Dialog } from "nsh/base";
import { Code, Note, Page, Section, Segmented } from "../ui";
import pixels from "./shaders/pixels.wgsl";
import reveal from "./shaders/reveal.wgsl";
import wipe from "./shaders/wipe.wgsl";

const photos = [
  { title: "Harbor", note: "Boats at first light", color: "bg-sky-500" },
  { title: "Meadow", note: "Grass after the rain", color: "bg-emerald-500" },
  { title: "Canyon", note: "Red rock at noon", color: "bg-orange-500" },
  { title: "Glacier", note: "Ice in the blue hour", color: "bg-indigo-500" },
];
const durations = [300, 700, 1500] as const;

function Slide(props: { index: number }) {
  const photo = () => photos[props.index % photos.length];
  return (
    <View class={`h-48 max-w-[640px] justify-end gap-1 rounded-2xl p-5 ${photo().color}`}>
      <Text class="text-3xl font-black text-white">{photo().title}</Text>
      <Text class="text-sm text-white/80">{photo().note}</Text>
    </View>
  );
}

function Next(props: { label: string; onPress: () => void }) {
  return (
    <View class="self-start rounded-md border border-zinc-300 bg-white px-3 py-1.5 active:bg-zinc-100" onPress={props.onPress}>
      <Text class="text-xs font-medium text-zinc-700">{props.label}</Text>
    </View>
  );
}

export function ShaderTransitions() {
  const a = signal(0);
  const b = signal(0);
  const c = signal(0);
  const d = signal(0);
  const open = signal(false);
  const duration = signal<(typeof durations)[number]>(700);
  const support = shaderSupport();
  return (
    <Page
      title="Shader transitions"
      intro="<ShaderTransition src value duration> changes its children through a shader when value changes: sample_from(p) reads a picture of what they drew before, sample_to(p) what they draw now, and nsh.progress goes from 0 to 1 over duration milliseconds. The new children are views from the start; a change during a transition starts from what shows."
    >
      <Section title="A circle that grows" note="reveal.wgsl: the new side inside a circle growing from the middle. Pick a duration.">
        <Segmented options={durations} value={duration} onChange={(v) => duration.set(v)} format={(v) => `${v} ms`} />
        <ShaderTransition src={reveal} uniforms={{ edge: 3 }} value={a()} duration={duration()}>
          <Slide index={a()} />
        </ShaderTransition>
        <Next label="Next photo" onPress={() => a.set(a() + 1)} />
        <Code>{`<ShaderTransition src={reveal} uniforms={{ edge: 3 }} value={index} duration={${duration()}}>`}</Code>
      </Section>

      <Section title="A wipe at an angle" note="wipe.wgsl: a soft edge that sweeps across, 0.3 radians off vertical.">
        <ShaderTransition src={wipe} uniforms={{ angle: 0.3, soft: 24 }} value={b()} duration={900}>
          <Slide index={b() + 1} />
        </ShaderTransition>
        <Next label="Wipe" onPress={() => b.set(b() + 1)} />
      </Section>

      <Section title="Pixels" note="pixels.wgsl: the old side breaks into blocks, the new one forms from them.">
        <ShaderTransition src={pixels} uniforms={{ most: 28 }} value={c()} duration={1000}>
          <Slide index={c() + 2} />
        </ShaderTransition>
        <Next label="Pixelate" onPress={() => c.set(c() + 1)} />
      </Section>

      <Section title="No shader: the fallback" note={'Without src a transition runs its fallback: a cross-fade ("fade", the default) or nothing ("none").'}>
        <ShaderTransition value={d()} duration={600}>
          <Slide index={d() + 3} />
        </ShaderTransition>
        <Next label="Cross-fade" onPress={() => d.set(d() + 1)} />
      </Section>

      <Section
        title="A dialog through a shader"
        note="A Dialog's (or a NavPage's) animation takes { shader, uniforms, duration }: what is behind it is sample_from, the dialog sample_to, and nsh.progress how much of it shows (0 → 1 as it opens, 1 → 0 as it closes)."
      >
        <Next label="Open the dialog" onPress={() => open.set(true)} />
        <Dialog
          open={open()}
          onOpenChange={(o) => open.set(o)}
          animation={{ shader: reveal, uniforms: { edge: 4 }, duration: 700 }}
          backdropClass="bg-black/45"
          class="m-auto w-80 max-w-[90%] gap-3 rounded-2xl bg-violet-600 p-5"
        >
          <Text class="text-2xl font-extrabold text-white">Revealed</Text>
          <Text class="text-sm text-white/85">It came through reveal.wgsl and goes back the same way.</Text>
          <Next label="Close" onPress={() => open.set(false)} />
        </Dialog>
        <Code>{`<Dialog animation={{ shader: reveal, uniforms: { edge: 4 }, duration: 700 }}>`}</Code>
      </Section>

      <Note>{`shaderSupport().transition here: ${String(support.transition)} ("live" or "snapshot": the children change through the shader; false: they change at once).`}</Note>
    </Page>
  );
}
