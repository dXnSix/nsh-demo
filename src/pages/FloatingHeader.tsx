import { List, Scroll, Text, View } from "nsh";
import { createAnimatedValue } from "nsh/animated";
import { hoverScrollBar, Note, Page, Section } from "../ui";

/** The bar's height. */
const BAR = 48;

type Row = { day: string } | { title: string; time: string };

const rows: Row[] = [];
for (const day of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]) {
  rows.push({ day });
  for (let i = 1; i <= 12; i++) rows.push({ title: `${day} event ${i}`, time: `${8 + Math.floor(i / 2)}:${i % 2 ? "00" : "30"}` });
}
const days = rows.flatMap((row, i) => ("day" in row ? [i] : []));

/** A framed list with a floating bar over it; `snap` settles the bar shown
 * or hidden when the scrolling stops. */
function FloatingList(props: { snap: boolean; id: string; label: string }) {
  const scroll = createAnimatedValue(0);
  // How much of the bar is hidden: it follows the scrolling's changes, kept
  // within 0..BAR, so scrolling back a little brings it back at once. With
  // `snap`, when the scroll view comes to rest it finishes the move: fully
  // hidden past half, else fully shown (always shown near the top).
  const hidden = scroll.diffClamp(0, BAR, { snap: props.snap });
  // How much of it shows: where the day headings stick.
  const shown = hidden.mul(-1).add(BAR);
  const bar = hoverScrollBar();
  return (
    <View class="w-full max-w-[400px] gap-2">
      <Text class="text-sm font-semibold text-zinc-700">{props.label}</Text>
      <View class="h-[560px] overflow-hidden rounded-xl border border-zinc-300 bg-white" {...bar.hover}>
        <Scroll testID={props.id} ref={bar.ref} scrollValue={scroll} scrollbar={false} onScroll={bar.onScroll} style={{ flex: 1 }}>
          <View onLayout={bar.onContentLayout} style={{ paddingTop: BAR }}>
            <List viewport="parent" each={rows} estimatedItemSize={44} stickyHeaderIndices={days} stickyHeaderOffset={shown}>
              {(row) => (
                <If
                  when={"day" in row()}
                  else={
                    <View class="h-11 flex-row items-center border-b border-zinc-100 px-4">
                      <Text class="flex-1 text-sm text-zinc-800">{(row() as { title: string }).title}</Text>
                      <Text class="text-xs text-zinc-500">{(row() as { time: string }).time}</Text>
                    </View>
                  }
                >
                  <View class="h-8 justify-center border-b border-sky-200 bg-sky-50 px-4">
                    <Text class="text-xs font-bold uppercase tracking-wide text-sky-800">{(row() as { day: string }).day}</Text>
                  </View>
                </If>
              )}
            </List>
          </View>
        </Scroll>
        <View
          class="absolute inset-x-0 top-0 flex-row items-center gap-2 border-b border-zinc-200 bg-white px-4"
          style={{ height: BAR, transform: [{ translateY: hidden.mul(-1) }] }}
        >
          <Text class="flex-1 text-base font-semibold text-zinc-900">This week</Text>
          <Text class="text-xs text-zinc-500">{props.snap ? "snaps shown or hidden" : "stops where you stop"}</Text>
        </View>
        {bar.bar()}
      </View>
    </View>
  );
}

export function FloatingHeader() {
  return (
    <Page
      title="Floating header"
      intro={'A bar that hides as the content scrolls down and comes back as soon as it scrolls a little up, wherever the page is: diffClamp of the scroll view\'s scrollValue, bound to the bar\'s translateY. With { snap: true } it never stays half shown: when the scrolling comes to rest, it slides fully out past half and fully back in otherwise (always back near the top, where hiding it would leave a gap), in 200 ms on the UI thread. The list lies in the page (viewport="parent") and stays virtualized; its day headings stick just below the bar wherever it is, with stickyHeaderOffset set to how much of the bar shows. All of it moves natively, with no JS per frame.'}
    >
      <Section
        title="diffClamp, with and without snap"
        note="Scroll down, then up a little and let go. On the left the bar stays half out where you stopped; on the right it finishes the move, and the heading below it follows."
      >
        <View class="flex-row flex-wrap gap-6">
          <FloatingList id="demo-scroll" snap={false} label="Without snap: diffClamp(0, 48)" />
          <FloatingList id="snap-scroll" snap={true} label="With snap: diffClamp(0, 48, { snap: true })" />
        </View>
        <Note>The bar is over the list, not in it: the list starts BAR points down, so nothing hides under the bar at the top.</Note>
      </Section>
    </Page>
  );
}
