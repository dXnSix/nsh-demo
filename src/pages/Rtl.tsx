import { Text, View } from "nsh";
import { Compare, Note, Page, Section } from "../ui";

function Card(props: { class?: string; style?: Record<string, unknown>; label: string }) {
  return (
    <View class={`bg-sky-100 border-sky-600 ${props.class ?? ""}`} style={props.style}>
      <Text class={`text-sm text-sky-900 ${props.class?.includes("text-left") ? "text-left" : ""}`}>{props.label}</Text>
    </View>
  );
}

export function Rtl() {
  return (
    <Page
      title="Right to left"
      intro="Physical classes (pl/pr, ml/mr, left/right, border-l/r, rounded-l/r/tl/tr/bl/br, text-left/right) now stay on their side when the layout runs right to left, as in a browser. Logical classes (ps/pe, ms/me, start/end, border-s/e, rounded-s/e, text-start/end) follow the direction. Inline style keys keep React Native's mirroring."
    >
      <Section title="Physical classes in an RTL container" note="Both panels are inside a View with style direction: 'rtl'.">
        <Compare
          nowCode={`class="pl-10 border-l-8 rounded-tl-3xl text-left"`}
          now={
            <View style={{ direction: "rtl" }}>
              <Card class="pl-10 py-3 border-l-8 rounded-tl-3xl text-left" label="padding, border and corner on the left" />
            </View>
          }
          beforeCode={`style={{ paddingLeft: 40, borderLeftWidth: 8, borderTopLeftRadius: 24 }} (mirrored)`}
          before={
            <View style={{ direction: "rtl" }}>
              <Card
                class="py-3"
                style={{ paddingLeft: 40, borderLeftWidth: 8, borderTopLeftRadius: 24, textAlign: "left" }}
                label="mirrored to the right"
              />
            </View>
          }
        />
      </Section>

      <Section title="Logical classes follow the direction">
        <Compare
          nowLabel="LTR"
          beforeLabel="RTL"
          nowCode={`class="ps-10 border-s-8 rounded-ss-3xl text-start"`}
          now={
            <View style={{ direction: "ltr" }}>
              <View class="bg-amber-100 border-amber-600 ps-10 py-3 border-s-8 rounded-ss-3xl">
                <Text class="text-sm text-amber-900 text-start">start is the left</Text>
              </View>
            </View>
          }
          beforeCode={`the same classes, direction: "rtl"`}
          before={
            <View style={{ direction: "rtl" }}>
              <View class="bg-amber-100 border-amber-600 ps-10 py-3 border-s-8 rounded-ss-3xl">
                <Text class="text-sm text-amber-900 text-start">start is the right</Text>
              </View>
            </View>
          }
        />
        <Note>This pair compares directions, not old and new: logical classes already worked.</Note>
      </Section>
    </Page>
  );
}
