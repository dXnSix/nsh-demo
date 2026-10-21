import { Text, View } from "nsh";
import { Code, Note, Page, Section } from "../ui";

// Classes NSH now refuses (a build warning and one runtime log each): they
// set nothing, so each box looks as if the class were not there.
const unknown: { cls: string; why: string }[] = [
  { cls: "sticky top-4", why: "no native sticky positioning yet (top-4 still shifts the box)" },
  { cls: "order-2", why: "the layout engine has no order" },
  { cls: "transform-3d", why: "children are flattened into the parent's plane" },
  { cls: "select-all", why: "no select-all-on-tap" },
  { cls: "border-double border-4", why: "one line is drawn" },
  { cls: "w-fit", why: "no intrinsic sizes (also min/max and h-, size-, min-*, max-*)" },
  { cls: "snap-x snap-mandatory", why: "Scroll's snap props exist; the classes are not mapped yet" },
  { cls: "-gap-4", why: "Tailwind has no negative gap" },
  { cls: "p-1/2", why: "Tailwind has no padding fractions" },
  { cls: "z-1.5", why: "z-* takes integers" },
];

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
              <View class={`h-10 w-28 items-center justify-center rounded-md bg-zinc-200 ${u.cls}`}>
                <Text class="text-[11px] text-zinc-600">box</Text>
              </View>
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
