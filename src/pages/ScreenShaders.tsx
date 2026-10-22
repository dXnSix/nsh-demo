import { ScreenEffect, ScreenTransition, shaderSupport, signal, Text, View } from "nsh";
import { Dialog } from "nsh/base";
import { Code, Note, Page, Section, Segmented } from "../ui";
import calm from "./shaders/calm.wgsl";
import mosaic from "./shaders/mosaic.wgsl";
import pixels from "./shaders/pixels.wgsl";
import ring from "./shaders/ring.wgsl";
import scanlines from "./shaders/scanlines.wgsl";
import wipe from "./shaders/wipe.wgsl";

const effects = ["none", "calm", "scanlines", "mosaic"] as const;
const transitions = ["ring", "wipe", "pixels", "fade"] as const;

function Button(props: { label: string; onPress: () => void }) {
  return (
    <View class="self-start rounded-md border border-zinc-300 bg-white px-3 py-1.5 active:bg-zinc-100" onPress={props.onPress}>
      <Text class="text-xs font-medium text-zinc-700">{props.label}</Text>
    </View>
  );
}

export function ScreenShaders() {
  const effect = signal<(typeof effects)[number]>("none");
  const transition = signal<(typeof transitions)[number]>("ring");
  const night = signal(false);
  const open = signal(false);
  const support = shaderSupport();
  return (
    <Page
      title="Screen shaders"
      intro="<ScreenEffect> draws the whole screen through a shader: every page, dialog and overlay is what sample_content(p) reads, p in points from the screen's top-left, and the views keep their presses. <ScreenTransition> changes the whole screen through a shader when its value changes. Both can be declared anywhere and take no space."
    >
      {/* The page's own: they go with it. The last screen effect made with a
          shader draws; each transition runs only with its own shader. */}
      <ScreenEffect src={effect() === "calm" ? calm : null} />
      <ScreenEffect src={effect() === "scanlines" ? scanlines : null} uniforms={{ gap: 3 }} />
      <ScreenEffect src={effect() === "mosaic" ? mosaic : null} uniforms={{ size: 6 }} />
      <ScreenTransition src={transition() === "ring" ? ring : null} fallback="none" value={night()} duration={900} />
      <ScreenTransition src={transition() === "wipe" ? wipe : null} fallback="none" uniforms={{ angle: 0.3, soft: 24 }} value={night()} duration={900} />
      <ScreenTransition src={transition() === "pixels" ? pixels : null} fallback="none" uniforms={{ most: 28 }} value={night()} duration={900} />
      <ScreenTransition fallback={transition() === "fade" ? "fade" : "none"} value={night()} duration={900} />

      <Section title="The whole screen through a shader" note="Pick an effect: the sidebar, this page and a dialog all draw through it, and the buttons still press.">
        <Segmented options={effects} value={effect} onChange={(v) => effect.set(v)} />
        <Code>{`<ScreenEffect src={${effect() === "none" ? "null" : effect()}} />`}</Code>
      </Section>

      <Section title="The whole screen changing through a shader" note="The panel switches between day and night; the screen goes from one to the other through the shader you pick (fade: no src, the cross-fade fallback).">
        <Segmented options={transitions} value={transition} onChange={(v) => transition.set(v)} />
        <View class={`h-40 max-w-[640px] justify-end gap-1 rounded-2xl p-5 ${night() ? "bg-indigo-950" : "bg-amber-100"}`}>
          <Text class={`text-3xl font-black ${night() ? "text-white" : "text-amber-900"}`}>{night() ? "Night" : "Day"}</Text>
          <Text class={`text-sm ${night() ? "text-indigo-200" : "text-amber-700"}`}>{night() ? "The stars are out" : "The sun is up"}</Text>
        </View>
        <Button label={night() ? "Back to day" : "On to night"} onPress={() => night.set(!night())} />
        <Code>{`<ScreenTransition src={${transition() === "fade" ? "null" : transition()}} value={night()} duration={900} />`}</Code>
      </Section>

      <Section title="Dialogs too" note="A dialog draws through the screen effect as well.">
        <Button label="Open a dialog" onPress={() => open.set(true)} />
        <Dialog open={open()} onOpenChange={(o) => open.set(o)} backdropClass="bg-black/40" class="m-auto w-80 max-w-[90%] gap-3 rounded-2xl bg-rose-500 p-5">
          <Text class="text-2xl font-extrabold text-white">Over everything</Text>
          <Text class="text-sm text-white/85">The screen effect covers dialogs and overlays too.</Text>
          <Button label="Close" onPress={() => open.set(false)} />
        </Dialog>
      </Section>

      <Note>{`shaderSupport() here: screenEffect ${String(support.screenEffect)}, screenTransition ${String(support.screenTransition)} ("live" or "snapshot"; false: the screen draws, or changes, as it is).`}</Note>
    </Page>
  );
}
