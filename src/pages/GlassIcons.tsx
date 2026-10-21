import { Shader, signal, Text, View } from "nsh";
import { createAnimatedValue } from "nsh/animated";
import { Note, Page, Section } from "../ui";
import glassCard from "./shaders/glass-card.wgsl";
import glassIcon from "./shaders/glass-icon.wgsl";

const icons = [
  { label: "Files", glyph: "▤", tint: "#60a5fa", shade: "#4f46e5" },
  { label: "Books", glyph: "✎", tint: "#c084fc", shade: "#7c3aed" },
  { label: "Health", glyph: "♥", tint: "#fb7185", shade: "#e11d48" },
  { label: "Weather", glyph: "☁", tint: "#5eead4", shade: "#0ea5e9" },
  { label: "Notes", glyph: "✱", tint: "#fde047", shade: "#f97316" },
  { label: "Stats", glyph: "▲", tint: "#86efac", shade: "#059669" },
] as const;

/** One icon: the shader draws both tiles; `lift` moves them, on the UI thread. */
function GlassIcon(props: { label: string; glyph: string; tint: string; shade: string }) {
  const lift = createAnimatedValue(0);
  const up = () => lift.spring(1, { stiffness: 260, damping: 18 });
  const down = () => lift.spring(0, { stiffness: 260, damping: 18 });
  return (
    <View class="items-center gap-2" onHoverIn={up} onHoverOut={down} onPressDown={up} onPressUp={down}>
      <Shader
        src={glassIcon}
        uniforms={{ tint: props.tint, shade: props.shade, lift }}
        class="size-24 items-center justify-center"
        style={{ transform: [{ translateY: lift.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }}
      >
        <Text class="pl-1.5 pt-1.5 text-3xl text-white">{props.glyph}</Text>
      </Shader>
      <Text class="text-xs font-medium text-zinc-300">{props.label}</Text>
    </View>
  );
}

export function GlassIcons() {
  const x = createAnimatedValue(0);
  const y = createAnimatedValue(0);
  const drags = signal(0);
  return (
    <Page
      title="Glass icons"
      intro="Glass made with fill shaders, in the style of react-bits' GlassIcons: each shader draws its own content (a tilted color tile, a scene of moving lights) and a pane of glass over it that frosts and bends what it drew. Animated values move the glass through uniforms, so hovers, presses and drags run on the UI thread."
    >
      <Section
        title="Glass icons"
        note="Hover an icon (desktop) or press it: a spring on the lift uniform tilts the back tile and raises the glass. The glyph is a Text child over the shader."
      >
        <View class="max-w-[800px] flex-row flex-wrap justify-center gap-6 rounded-2xl bg-zinc-900 px-6 py-8">
          {icons.map((icon) => (
            <GlassIcon {...icon} />
          ))}
        </View>
      </Section>

      <Section
        title="A glass card over a moving scene"
        note="Drag the card. pan={{ x, y }} drives two animated values; the shader reads them as its offset uniform and the card's text moves with the same values, so the drag never runs JS. Release it and it springs back."
      >
        <View
          class="h-72 max-w-[720px] overflow-hidden rounded-2xl"
          pan={{ x, y }}
          onPanEnd={(e) => {
            drags.set(drags() + 1);
            x.spring(0, { velocity: e.velocityX, stiffness: 160, damping: 14 });
            y.spring(0, { velocity: e.velocityY, stiffness: 160, damping: 14 });
          }}
        >
          <Shader
            src={glassCard}
            uniforms={{ offset: [x, y], card: { width: 240, height: 140 }, radius: 24 }}
            class="flex-1 items-center justify-center"
          >
            <View class="h-[140px] w-60 justify-center gap-1 px-6" style={{ transform: [{ translateX: x }, { translateY: y }] }}>
              <Text class="text-xs font-semibold uppercase tracking-wide text-white/70">Glass</Text>
              <Text class="text-xl font-bold text-white">Drag me</Text>
              <Text class="text-xs text-white/70">{`released ${drags()}×`}</Text>
            </View>
          </Shader>
        </View>
        <Note>The glass samples nothing behind the view: a fill shader draws the scene it frosts. Glass over other views is a backdrop shader, a later step.</Note>
      </Section>
    </Page>
  );
}
