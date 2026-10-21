import { List, signal, Text, View } from "nsh";
import { hoverScrollBar, Note, Page, Section, Segmented } from "../ui";

type Row = { header: string } | { item: string };

const rows: Row[] = [];
const headers: number[] = [];
for (const letter of "ABCDEFGHIJ") {
  headers.push(rows.length);
  rows.push({ header: `Section ${letter}` });
  for (let i = 1; i <= 8; i++) rows.push({ item: `${letter}${i}` });
}

const BAR = 44;
// Headers are h-9, items h-11: the list's height before it reports one.
const HEIGHT = rows.reduce((h, row) => h + ("header" in row ? 36 : 44), 0);
const offsets = [0, BAR, -12] as const;

export function Sticky() {
  const offset = signal<(typeof offsets)[number]>(BAR);
  const scroll = hoverScrollBar(HEIGHT);
  return (
    <Page
      title="Sticky list headers"
      intro="stickyHeaderIndices pins section headers; stickyHeaderOffset pins them a distance from the top, under a translucent bar the content scrolls beneath. The next header pushes the pinned one out from that offset; a negative offset leaves part of a header out of view. Also fixed: the row before the pinned one stays rendered, and on the web the pinned headers stay in step with the browser's scrolling and keep their layer, events and stacking."
    >
      <Section title="stickyHeaderOffset">
        <Segmented
          options={offsets}
          value={offset}
          onChange={(v) => offset.set(v)}
          format={(v) => (v === BAR ? `${v} (under the bar)` : String(v))}
        />
        <View class="h-[420px] w-full max-w-[420px] overflow-hidden rounded-xl border border-zinc-300" {...scroll.hover}>
          <List
            each={rows}
            stickyHeaderIndices={headers}
            stickyHeaderOffset={offset()}
            estimatedItemSize={44}
            style={{ flex: 1 }}
            scrollbar={false}
            onScroll={scroll.onScroll}
          >
            {(row) => (
              <If
                when={"header" in row()}
                else={
                  <View onPress={() => {}} class="h-11 justify-center border-b border-zinc-100 px-4 active:bg-zinc-100">
                    <Text class="text-sm text-zinc-800">Item {(row() as { item: string }).item}</Text>
                  </View>
                }
              >
                <View class="h-9 justify-center bg-amber-100 px-4 border-b border-amber-300">
                  <Text class="text-xs font-bold uppercase tracking-wide text-amber-900">{(row() as { header: string }).header}</Text>
                </View>
              </If>
            )}
          </List>
          <View class="absolute inset-x-0 top-0 h-11 justify-center bg-white/70 px-4 border-b border-zinc-200" pointerEvents="none">
            <Text class="text-sm font-semibold text-zinc-900">Translucent bar ({BAR}pt)</Text>
          </View>
          {scroll.bar()}
        </View>
        <Note>Scroll the list. With the offset at 44 the headers stick just under the bar; at 0 they slide under it; at -12 their top is cut off.</Note>
      </Section>
    </Page>
  );
}
