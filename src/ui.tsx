// Shared building blocks of the demo pages: a page, a section, a pair of
// panels comparing what a class does now with what NSH did before, and a
// code label.
import { type Bounds, type JSX, Scroll, type ScrollEvent, signal, Text, View, type YNode } from "nsh";

/**
 * A vertical scroll bar the app draws for a scroll view or list: it shows
 * while the mouse is over the view and fades when the mouse leaves (NSH's own
 * bar shows only while scrolling), and dragging it scrolls the view. Turn the
 * view's indicator off (`scrollbar={false}`) and pass it `ref` and `onScroll`;
 * spread `hover` on the view around it and put `bar()` last in that view.
 * `contentHeight` is the content's height until the view reports it (a list's
 * rows of known heights); a `Scroll` reports it through `onContentLayout` on a
 * view around its content.
 */
export function hoverScrollBar(contentHeight = 0) {
  const hovered = signal(false);
  const dragging = signal(false);
  const view = signal(0);
  const content = signal(contentHeight);
  const offset = signal(0);
  const MARGIN = 2;
  let node: YNode | null = null;
  let drag = { y: 0, offset: 0 };
  // The thumb's top and length, or null when everything fits.
  const thumb = () => {
    const [v, c] = [view(), content()];
    if (v <= 0 || c <= v + 1) return null;
    const track = v - 2 * MARGIN;
    const len = Math.max(32, (track * v) / c);
    const t = Math.min(Math.max(offset() / (c - v), 0), 1);
    return { top: MARGIN + t * (track - len), height: len, travel: track - len };
  };
  const shown = () => (hovered() || dragging()) && thumb() !== null;
  return {
    hover: {
      onHoverIn: () => hovered.set(true),
      onHoverOut: () => hovered.set(false),
      onLayout: (b: Bounds) => view.set(b.size.height),
    },
    ref: (n: YNode) => {
      node = n;
    },
    onScroll: (e: ScrollEvent) => {
      offset.set(e.offset.y);
      content.set(e.contentSize.height);
      view.set(e.size.height);
    },
    onContentLayout: (b: Bounds) => content.set(b.size.height),
    // A strip wider than the bar, so it is easy to grab; the content moves
    // the other way, as much as keeps the thumb under the pointer.
    bar: () => (
      <View
        pointerEvents={shown() ? "auto" : "none"}
        class="absolute right-0 w-3 items-center"
        style={{ top: thumb()?.top ?? 0, height: thumb()?.height ?? 0 }}
        onStartShouldSetResponder={() => true}
        onResponderGrant={(e) => {
          drag = { y: e.pageY, offset: offset() };
          dragging.set(true);
          return true;
        }}
        onResponderMove={(e) => {
          const t = thumb();
          if (!t || t.travel <= 0) return;
          const max = content() - view();
          const y = drag.offset + ((e.pageY - drag.y) * max) / t.travel;
          node?.scrollTo({ y: Math.min(Math.max(y, 0), max), animated: false });
        }}
        onResponderRelease={() => dragging.set(false)}
        onResponderTerminate={() => dragging.set(false)}
      >
        <View
          class={`h-full w-1.5 rounded-full transition-opacity duration-300 ${dragging() ? "bg-zinc-500" : "bg-zinc-400/80"} ${shown() ? "opacity-100" : "opacity-0"}`}
        />
      </View>
    ),
  };
}

/** A vertical `Scroll` whose bar shows while the mouse is over it and drags (`hoverScrollBar`); `class` and `style` go on its content. */
export function HoverScroll(props: { class?: string; style?: Record<string, unknown>; children: JSX.Element }) {
  const s = hoverScrollBar();
  return (
    <View class="flex-1" {...s.hover}>
      <Scroll ref={s.ref} style={{ flex: 1 }} scrollbar={false} onScroll={s.onScroll}>
        <View class={props.class} style={props.style} onLayout={s.onContentLayout}>
          {props.children}
        </View>
      </Scroll>
      {s.bar()}
    </View>
  );
}

/** A demo page: a title, what it shows, then its sections. */
export function Page(props: { title: string; intro: string; children: JSX.Element }) {
  return (
    <HoverScroll style={{ padding: 28, gap: 28, paddingBottom: 64 }}>
      <View class="gap-2">
        <Text class="text-2xl font-bold text-zinc-900">{props.title}</Text>
        <Text class="text-sm text-zinc-600 max-w-[680px]">{props.intro}</Text>
      </View>
      {props.children}
    </HoverScroll>
  );
}

/** A group of examples under a heading. */
export function Section(props: { title: string; note?: string; children: JSX.Element }) {
  return (
    <View class="gap-3">
      <View class="gap-1">
        <Text class="text-base font-semibold text-zinc-900">{props.title}</Text>
        {props.note ? <Text class="text-xs text-zinc-500 max-w-[680px]">{props.note}</Text> : null}
      </View>
      {props.children}
    </View>
  );
}

/** A class or value, in a monospace chip. */
export function Code(props: { children: string }) {
  return (
    <View class="self-start rounded-md bg-zinc-100 px-2 py-1">
      <Text class="font-mono text-xs text-zinc-800">{props.children}</Text>
    </View>
  );
}

/** One panel of a comparison: a label, the code it uses, the result. */
function Panel(props: { label: string; tone: "now" | "before"; code: string; children: JSX.Element }) {
  const now = props.tone === "now";
  return (
    <View
      class={`flex-1 min-w-[240px] gap-2 rounded-xl border p-3 ${now ? "border-emerald-300 bg-emerald-50/40" : "border-zinc-200 bg-zinc-50"}`}
    >
      <Text class={`text-[11px] font-semibold uppercase tracking-wide ${now ? "text-emerald-700" : "text-zinc-500"}`}>
        {props.label}
      </Text>
      <Code>{props.code}</Code>
      <View class="rounded-lg bg-white p-3 border border-zinc-200 overflow-hidden">{props.children}</View>
    </View>
  );
}

/**
 * What a class does now (its browser meaning) beside what NSH did before,
 * the "before" drawn with styles that reproduce the old result.
 */
export function Compare(props: {
  now: JSX.Element;
  nowCode: string;
  before: JSX.Element;
  beforeCode: string;
  nowLabel?: string;
  beforeLabel?: string;
}) {
  return (
    <View class="flex flex-row flex-wrap gap-3">
      <Panel label={props.nowLabel ?? "Now (as in a browser)"} tone="now" code={props.nowCode}>
        {props.now}
      </Panel>
      <Panel label={props.beforeLabel ?? "Before (old NSH result)"} tone="before" code={props.beforeCode}>
        {props.before}
      </Panel>
    </View>
  );
}

/** A small colored square with a label, the unit most examples move around. */
export function Chip(props: { label: string; color?: string; class?: string; style?: Record<string, unknown> }) {
  return (
    <View
      class={`h-10 min-w-10 items-center justify-center rounded-md px-2 ${props.color ?? "bg-sky-500"} ${props.class ?? ""}`}
      style={props.style}
    >
      <Text class="text-xs font-semibold text-white">{props.label}</Text>
    </View>
  );
}

/** A round avatar (for the overlapping `-space-x-*` stack). */
export function Avatar(props: { label: string; color: string }) {
  return (
    <View class={`size-10 items-center justify-center rounded-full border-2 border-white ${props.color}`}>
      <Text class="text-xs font-bold text-white">{props.label}</Text>
    </View>
  );
}

/** A note under an example. */
export function Note(props: { children: string }) {
  return <Text class="text-xs text-zinc-500 max-w-[680px]">{props.children}</Text>;
}

/** A row of toggle buttons. */
export function Segmented<T extends string | number>(props: {
  options: readonly T[];
  value: () => T;
  onChange: (value: T) => void;
  format?: (value: T) => string;
}) {
  return (
    <View class="flex flex-row flex-wrap gap-2">
      {props.options.map((option) => (
        <View
          onPress={() => props.onChange(option)}
          class={`rounded-md border px-3 py-1.5 ${props.value() === option ? "border-zinc-900 bg-zinc-900" : "border-zinc-300 bg-white"}`}
        >
          <Text class={`text-xs font-medium ${props.value() === option ? "text-white" : "text-zinc-700"}`}>
            {props.format ? props.format(option) : String(option)}
          </Text>
        </View>
      ))}
    </View>
  );
}
