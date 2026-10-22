import { List, Scroll, Text, View } from "nsh";
import { createAnimatedValue } from "nsh/animated";
import { hoverScrollBar, Note, Page, Section } from "../ui";

/** How tall the header is open, and the bar it collapses to. */
const OPEN = 200;
const BAR = 52;
/** How far the page scrolls while the header collapses. */
const RANGE = OPEN - BAR;

type Row = { week: number } | { title: string; detail: string };

const rows: Row[] = [];
for (let week = 1; week <= 20; week++) {
  rows.push({ week });
  for (let i = 1; i <= 8; i++) rows.push({ title: `Entry ${week}.${i}`, detail: `${(week * 7 + i * 3) % 60} min` });
}
const weeks = rows.flatMap((row, i) => ("week" in row ? [i] : []));

export function CollapsingHeader() {
  const scroll = createAnimatedValue(0);
  // 0 open, 1 collapsed.
  const collapsed = scroll.interpolate({ inputRange: [0, RANGE], outputRange: [0, 1] });
  const bar = hoverScrollBar();
  return (
    <Page
      title="Collapsing header"
      intro={
        'A sliver page: a header that collapses to a pinned bar as the page scrolls (Flutter\'s SliverAppBar), a virtualized list and a footer, in one scroll view. The header is position: "sticky" with a negative top, so it scrolls until its last 52 points show and then stays. Its picture moves at half speed, its title shrinks into the bar and its color fills in, from the scroll view\'s scrollValue through interpolate, natively. The list lies in the page (viewport="parent"): only the rows near the view exist, its week headings stick just below the bar, and the footer comes after its full length.'
      }
    >
      <Section
        title="A sliver header, a virtual list and a footer"
        note="Scroll slowly through the first 148 points to see the header collapse, then on to the footer. Pulled past the top (macOS, iOS), the picture stretches."
      >
        <View class="h-[600px] w-full max-w-[420px] overflow-hidden rounded-xl border border-zinc-300 bg-white" {...bar.hover}>
          <Scroll testID="demo-scroll" ref={bar.ref} scrollValue={scroll} scrollbar={false} onScroll={bar.onScroll} style={{ flex: 1 }}>
            <View onLayout={bar.onContentLayout}>
              {/* Sticky with a negative top: it scrolls RANGE, then pins its last BAR points. */}
              <View class="overflow-hidden bg-indigo-700" style={{ position: "sticky", top: -RANGE, height: OPEN }}>
                {/* The picture: half speed while it collapses, stretched when pulled past the top. */}
                <View
                  class="absolute inset-x-0 top-0 bg-indigo-500"
                  style={{
                    height: OPEN,
                    transformOrigin: "center bottom",
                    transform: [
                      { translateY: scroll.interpolate({ inputRange: [0, RANGE], outputRange: [0, RANGE / 2] }) },
                      { scale: scroll.interpolate({ inputRange: [-OPEN, 0], outputRange: [2, 1] }) },
                    ],
                  }}
                >
                  <View class="absolute left-8 top-5 h-28 w-28 rounded-full bg-white/20" />
                  <View class="absolute right-10 top-14 h-16 w-16 rounded-full bg-white/10" />
                </View>
                {/* Fills in with the bar's color as it collapses. */}
                <View class="absolute inset-0 bg-indigo-700" style={{ opacity: collapsed }} />
                {/* Shown while open, above the bar's strip. */}
                <Text
                  class="absolute left-4 text-sm text-white"
                  style={{ bottom: BAR - 4, opacity: collapsed.interpolate({ inputRange: [0, 0.5], outputRange: [0.85, 0] }) }}
                >
                  160 entries, by week
                </Text>
                {/* The title, centered in the header's last BAR points: the bar it collapses to. */}
                <View class="absolute inset-x-4 bottom-0 justify-center" style={{ height: BAR }}>
                  <Text
                    class="self-start text-3xl font-bold text-white"
                    style={{
                      transformOrigin: "left center",
                      transform: [{ scale: collapsed.interpolate({ inputRange: [0, 1], outputRange: [1, 0.62] }) }],
                    }}
                  >
                    Recent
                  </Text>
                </View>
              </View>
              <List viewport="parent" each={rows} estimatedItemSize={48} stickyHeaderIndices={weeks} stickyHeaderOffset={BAR}>
                {(row) => (
                  <If
                    when={"week" in row()}
                    else={
                      <View class="h-12 flex-row items-center border-b border-zinc-100 px-4">
                        <Text class="flex-1 text-sm text-zinc-800">{(row() as { title: string }).title}</Text>
                        <Text class="text-xs text-zinc-500">{(row() as { detail: string }).detail}</Text>
                      </View>
                    }
                  >
                    <View class="h-8 justify-center border-b border-indigo-200 bg-indigo-50 px-4">
                      <Text class="text-xs font-bold uppercase tracking-wide text-indigo-800">Week {(row() as { week: number }).week}</Text>
                    </View>
                  </If>
                )}
              </List>
              {/* After the list's full length. */}
              <View class="items-center gap-1 px-4 pb-10 pt-8">
                <Text class="text-sm font-semibold text-zinc-900">That's all 160 entries</Text>
                <Text class="text-center text-xs text-zinc-500">A footer after the list: only the rows near the view exist.</Text>
              </View>
            </View>
          </Scroll>
          {bar.bar()}
        </View>
        <Note>
          Only opacity, colors, transforms and shadows animate natively, so the title shrinks with scale, not fontSize, and the header collapses by scrolling under its sticky top, not by changing its height.
        </Note>
      </Section>
    </Page>
  );
}
