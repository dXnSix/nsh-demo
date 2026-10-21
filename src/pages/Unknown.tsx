import { type JSX, Text, View } from "nsh";
import { Code, Note, Page, Section } from "../ui";

// Classes NSH now refuses (a build warning and one runtime log each): they
// set nothing, so each box looks as if the class were not there.
// Each class is written out literally so the build's class check sees it.
const unknown: { cls: string; why: string; box: JSX.Element }[] = [
  { cls: "sticky top-4", why: "no native sticky positioning yet (top-4 still shifts the box)", box: <View class="h-10 w-28 items-center justify-center rounded-md bg-zinc-200 sticky top-4"><BoxLabel /></View> },
  { cls: "order-2", why: "the layout engine has no order", box: <View class="h-10 w-28 items-center justify-center rounded-md bg-zinc-200 order-2"><BoxLabel /></View> },
  { cls: "transform-3d", why: "children are flattened into the parent's plane", box: <View class="h-10 w-28 items-center justify-center rounded-md bg-zinc-200 transform-3d"><BoxLabel /></View> },
  { cls: "select-all", why: "no select-all-on-tap", box: <View class="h-10 w-28 items-center justify-center rounded-md bg-zinc-200 select-all"><BoxLabel /></View> },
  { cls: "border-double border-4", why: "one line is drawn", box: <View class="h-10 w-28 items-center justify-center rounded-md bg-zinc-200 border-double border-4"><BoxLabel /></View> },
  { cls: "w-fit", why: "no intrinsic sizes (also min/max and h-, size-, min-*, max-*)", box: <View class="h-10 w-28 items-center justify-center rounded-md bg-zinc-200 w-fit"><BoxLabel /></View> },
  { cls: "snap-x snap-mandatory", why: "Scroll's snap props exist; the classes are not mapped yet", box: <View class="h-10 w-28 items-center justify-center rounded-md bg-zinc-200 snap-x snap-mandatory"><BoxLabel /></View> },
  { cls: "-gap-4", why: "Tailwind has no negative gap", box: <View class="h-10 w-28 items-center justify-center rounded-md bg-zinc-200 -gap-4"><BoxLabel /></View> },
  { cls: "p-1/2", why: "Tailwind has no padding fractions", box: <View class="h-10 w-28 items-center justify-center rounded-md bg-zinc-200 p-1/2"><BoxLabel /></View> },
  { cls: "z-1.5", why: "z-* takes integers", box: <View class="h-10 w-28 items-center justify-center rounded-md bg-zinc-200 z-1.5"><BoxLabel /></View> },
];

function BoxLabel() {
  return <Text class="text-[11px] text-zinc-600">box</Text>;
}

export function Unknown() {
  return (
    <Page
      title="Now unknown"
      intro="Classes NSH can't give their browser meaning are unknown: they warn when the app builds (file:line:col: unknown class '…'), log once at run time, and set nothing. These used to do something else, or nothing silently. Check the terminal that runs the app for the warnings."
    >
      <Section title="Each box carries one now-unknown class">
        <View class="gap-3">
          {unknown.map((u) => (
            <View class="flex flex-row items-center gap-3">
              {u.box}
              <View class="gap-1">
                <Code>{u.cls}</Code>
                <Text class="text-xs text-zinc-500">{u.why}</Text>
              </View>
            </View>
          ))}
        </View>
        <Note>Also unknown: selection:text-*, non-color placeholder:/selection: utilities, scroll-*, overscroll-*, touch-*, isolate, box-content, outline-double, and a minus sign where Tailwind has no negative.</Note>
      </Section>
    </Page>
  );
}
