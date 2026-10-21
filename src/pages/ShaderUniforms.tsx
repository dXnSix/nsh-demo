import { Shader, signal, Text, View } from "nsh";
import { createAnimatedValue, Easing } from "nsh/animated";
import { Code, Note, Page, Section, Segmented } from "../ui";
import spotlight from "./shaders/spotlight.wgsl";

const radii = [24, 56, 96] as const;
const colors = ["amber", "sky", "rose"] as const;
const hex = { amber: "#fbbf24", sky: "#38bdf8", rose: "#fb7185" };

export function ShaderUniforms() {
  const radius = createAnimatedValue(56);
  const sized = signal<(typeof radii)[number]>(56);
  const hue = createAnimatedValue(0);
  const color = hue.interpolate({ inputRange: [0, 1, 2], outputRange: [hex.amber, hex.sky, hex.rose] });
  const tinted = signal<(typeof colors)[number]>("amber");
  const x = createAnimatedValue(0);
  const y = createAnimatedValue(0);
  const pulse = createAnimatedValue(40);
  const pulsing = signal(false);
  const breathe = () => {
    pulsing.set(true);
    pulse.set(20);
    pulse.timing(110, { duration: 900, easing: Easing.inOut(Easing.cubic) });
    setTimeout(() => {
      pulse.timing(40, { duration: 700, easing: Easing.out(Easing.cubic) });
      pulsing.set(false);
    }, 900);
  };
  return (
    <Page
      title="Animated uniforms"
      intro="A uniform takes an animated value as well as a constant: a number for f32, one per component for vectors, a color interpolation for vec4f. NSH binds each to its place in the shader's buffer, so springs, timings and drags write it on the UI thread and the shader draws each frame they move, without running JS."
    >
      <Section title="radius: a spring" note="Pick a size: radius.spring(…) moves the f32 uniform.">
        <Segmented
          options={radii}
          value={sized}
          onChange={(v) => {
            sized.set(v);
            radius.spring(v, { stiffness: 120, damping: 10 });
          }}
          format={(v) => `${v}pt`}
        />
        <Shader src={spotlight} uniforms={{ color: hex.amber, offset: [0, 0], radius }} class="h-48 max-w-[640px] rounded-2xl" />
        <Code>{`uniforms={{ color: "${hex.amber}", offset: [0, 0], radius }}`}</Code>
      </Section>

      <Section title="color: an interpolation" note="A timing on hue moves color, hue.interpolate({ … outputRange: [amber, sky, rose] }), a vec4f uniform.">
        <Segmented
          options={colors}
          value={tinted}
          onChange={(v) => {
            tinted.set(v);
            hue.timing(colors.indexOf(v), { duration: 500, easing: Easing.out(Easing.cubic) });
          }}
        />
        <Shader src={spotlight} uniforms={{ color, offset: [0, 0], radius: 64 }} class="h-48 max-w-[640px] rounded-2xl" />
      </Section>

      <Section
        title="offset: a drag"
        note="Drag the light. pan={{ x, y }} drives x and y; offset: [x, y] binds them to the vec2f's two components. Release it and it springs back to the middle."
      >
        <View
          class="h-56 max-w-[640px] overflow-hidden rounded-2xl"
          pan={{ x, y }}
          onPanEnd={(e) => {
            x.spring(0, { velocity: e.velocityX, stiffness: 140, damping: 12 });
            y.spring(0, { velocity: e.velocityY, stiffness: 140, damping: 12 });
          }}
        >
          <Shader src={spotlight} uniforms={{ color: hex.sky, offset: [x, y], radius: 44 }} class="flex-1" />
        </View>
      </Section>

      <Section title="A timing in two steps" note="Tap Breathe: the radius grows, then settles, while JS only starts each timing.">
        <View class="flex-row items-center gap-3">
          <View class="rounded-md border border-zinc-300 bg-white px-3 py-1.5 active:bg-zinc-100" onPress={breathe}>
            <Text class="text-xs font-medium text-zinc-700">Breathe</Text>
          </View>
          <Text class="text-xs text-zinc-500">{pulsing() ? "growing" : "resting"}</Text>
        </View>
        <Shader src={spotlight} uniforms={{ color: hex.rose, offset: [0, 0], radius: pulse }} class="h-48 max-w-[640px] rounded-2xl" />
        <Note>Uniforms left out are 0; a uniform the shader does not have is a warning in the log.</Note>
      </Section>
    </Page>
  );
}
