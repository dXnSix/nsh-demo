import { signal, Text, View } from "nsh";
import { Compare, Note, Page, Section } from "../ui";

const LONG = "This sentence is long enough to wrap inside the panel when wrapping is allowed, and runs past its edge when it is not.";

export function Inheritance() {
  const nowTaps = signal(0);
  const beforeTaps = signal(0);
  return (
    <Page
      title="Inheritance"
      intro="As in CSS, white-space, text-wrap, truncate and select-* on a view now reach the texts inside it. pointer-events-none is inherited and a pointer-events-auto inside it takes touches again. Borders, outlines and rings without a color use the inherited text color (currentColor)."
    >
      <Section title="whitespace-nowrap on a container">
        <Compare
          nowCode={`<View class="whitespace-nowrap overflow-hidden"><Text>…`}
          now={
            <View class="whitespace-nowrap overflow-hidden">
              <Text class="text-sm text-zinc-800">{LONG}</Text>
            </View>
          }
          beforeCode={`the class did not reach the text`}
          before={
            <View class="overflow-hidden">
              <Text class="text-sm text-zinc-800">{LONG}</Text>
            </View>
          }
        />
      </Section>

      <Section title="select-text on a container" note="Try selecting the text: drag across it, or double-click / long-press.">
        <Compare
          nowCode={`<View class="select-text"><Text>…`}
          now={
            <View class="select-text">
              <Text class="text-sm text-zinc-800">Selectable: the container's select-text reaches this text.</Text>
            </View>
          }
          beforeCode={`the class did not reach the text`}
          before={
            <View>
              <Text class="text-sm text-zinc-800">Not selectable: texts are not selectable by default.</Text>
            </View>
          }
        />
      </Section>

      <Section title="pointer-events-none with a pointer-events-auto child" note="Tap the buttons. Only the child that opts back in should count.">
        <Compare
          nowCode={`<View class="pointer-events-none"><View class="pointer-events-auto" onPress>`}
          now={
            <View class="pointer-events-none gap-2">
              <View onPress={() => nowTaps.set(nowTaps() + 1)} class="pointer-events-auto self-start rounded-md bg-emerald-600 px-3 py-2">
                <Text class="text-xs font-semibold text-white">Tap me ({nowTaps()})</Text>
              </View>
            </View>
          }
          beforeCode={`pointerEvents="none" (the whole subtree ignored touches)`}
          before={
            <View pointerEvents="none" class="gap-2">
              <View onPress={() => beforeTaps.set(beforeTaps() + 1)} pointerEvents="auto" class="self-start rounded-md bg-zinc-500 px-3 py-2">
                <Text class="text-xs font-semibold text-white">Tap me ({beforeTaps()})</Text>
              </View>
            </View>
          }
        />
      </Section>

      <Section title="currentColor: border, outline and ring without a color" note="The parent sets text-rose-600; the boxes have no color classes.">
        <Compare
          nowCode={`<View class="text-rose-600"><View class="border-2"/><View class="ring-2"/><View class="outline-2"/>`}
          now={
            <View class="text-rose-600 flex flex-row gap-4 p-2">
              <View class="size-12 border-2" />
              <View class="size-12 ring-2" />
              <View class="size-12 outline-2" />
            </View>
          }
          beforeCode={`black borders and outlines; rings in black`}
          before={
            <View class="flex flex-row gap-4 p-2">
              <View class="size-12" style={{ borderWidth: 2, borderColor: "#000" }} />
              <View class="size-12 ring-2 ring-black" />
              <View class="size-12 outline-2 outline-black" />
            </View>
          }
        />
        <Note>The style keys keep React Native's default (black) when no color is set.</Note>
      </Section>
    </Page>
  );
}
