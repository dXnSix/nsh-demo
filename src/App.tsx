// NSH feature demo: a sidebar of features; the selected one's page renders
// in the middle. Lives outside the NSH repository: run it with any
// checkout's or worktree's `nsh` (see README.md). The root App.tsx is the entry `nsh`
// looks for; it imports this module.
import { type JSX, mount, signal, Text, View } from "nsh";
import { isAvailable as hasWindow, Window } from "nsh/desktop";
import { Borders } from "./pages/Borders";
import { Density } from "./pages/Density";
import { Effects } from "./pages/Effects";
import { GlassIcons } from "./pages/GlassIcons";
import { Inheritance } from "./pages/Inheritance";
import { Layout } from "./pages/Layout";
import { ObjectFit } from "./pages/ObjectFit";
import { Rtl } from "./pages/Rtl";
import { ShaderFills } from "./pages/ShaderFills";
import { ShaderSources } from "./pages/ShaderSources";
import { ShaderUniforms } from "./pages/ShaderUniforms";
import { Sticky } from "./pages/Sticky";
import { Svg } from "./pages/Svg";
import { TextValues } from "./pages/TextValues";
import { Transforms } from "./pages/Transforms";
import { Unknown } from "./pages/Unknown";
import { Variants } from "./pages/Variants";
import { HoverScroll } from "./ui";

type Feature = { id: string; name: string; detail: string; page: () => JSX.Element };

/** A group of features in the sidebar, expanded or collapsed. */
type Group = { id: string; title: string; features: Feature[] };

/** The features, by group; add a page under pages/ and an entry here. */
const groups: Group[] = [
  {
    id: "tailwind",
    title: "Tailwind",
    features: [
      { id: "layout", name: "Layout", detail: "inline, static, fixed, space-*", page: Layout },
      { id: "rtl", name: "Right to left", detail: "physical classes stay put", page: Rtl },
      { id: "inheritance", name: "Inheritance", detail: "white-space, select, pointer events, currentColor", page: Inheritance },
      { id: "text", name: "Text and values", detail: "line heights, pt, 65ch, small-caps", page: TextValues },
      { id: "borders", name: "Borders and outlines", detail: "border-none, outline styles", page: Borders },
      { id: "transforms", name: "Transforms", detail: "transform-none, rotate-z, perspective", page: Transforms },
      { id: "effects", name: "Gradients and shadows", detail: "Oklab mixing, drop-shadow layers", page: Effects },
      { id: "object-fit", name: "Images: object-fit", detail: "object-none, object-scale-down", page: ObjectFit },
      { id: "variants", name: "Variants and selection", detail: "group order, selection:bg-*", page: Variants },
      { id: "unknown", name: "Now unknown", detail: "classes that warn instead", page: Unknown },
    ],
  },
  {
    id: "shaders",
    title: "Shaders",
    features: [
      { id: "shader-fills", name: "Shader fills", detail: "nsh.time, noise, children over it", page: ShaderFills },
      { id: "glass-icons", name: "Glass icons", detail: "glass over self-drawn content", page: GlassIcons },
      { id: "shader-uniforms", name: "Animated uniforms", detail: "springs, color interpolation, drags", page: ShaderUniforms },
      { id: "shader-sources", name: "WGSL sources", detail: ".wgsl imports, createShader", page: ShaderSources },
    ],
  },
  {
    id: "svg",
    title: "SVG",
    features: [{ id: "svg", name: "SVG images", detail: "multicolor, sharp at any size", page: Svg }],
  },
  {
    id: "images",
    title: "Images",
    features: [{ id: "density", name: "Multi-resolution images", detail: "@1x / @2x / @3x siblings", page: Density }],
  },
  {
    id: "lists",
    title: "Lists",
    features: [{ id: "sticky", name: "Sticky list headers", detail: "stickyHeaderOffset and fixes", page: Sticky }],
  },
];

const all = groups.flatMap((g) => g.features);
const current = signal(all[0].id);
/** Which groups are expanded (all of them at first). */
const expanded = signal<Record<string, boolean>>(Object.fromEntries(groups.map((g) => [g.id, true])));

function SidebarItem(props: { feature: Feature }) {
  const active = () => current() === props.feature.id;
  return (
    <View
      testID={`nav-${props.feature.id}`}
      accessibilityLabel={props.feature.name}
      onPress={() => current.set(props.feature.id)}
      class={`ml-5 gap-0.5 rounded-lg px-3 py-2 ${active() ? "bg-zinc-900" : "hover:bg-zinc-200"}`}
    >
      <Text class={`text-sm font-medium ${active() ? "text-white" : "text-zinc-900"}`}>{props.feature.name}</Text>
      <Text class={`text-[11px] ${active() ? "text-zinc-300" : "text-zinc-500"}`}>{props.feature.detail}</Text>
    </View>
  );
}

/** A group's header, which expands or collapses its features, then the features. */
function SidebarGroup(props: { group: Group }) {
  const open = () => expanded()[props.group.id] ?? false;
  // The group holding the shown page, so it stays findable while collapsed.
  const holdsCurrent = () => props.group.features.some((f) => f.id === current());
  return (
    <View class="gap-1">
      <View
        testID={`group-${props.group.id}`}
        accessibilityLabel={`${props.group.title}, ${open() ? "expanded" : "collapsed"}`}
        onPress={() => expanded.set({ ...expanded(), [props.group.id]: !open() })}
        class="flex flex-row items-center gap-2 rounded-lg px-2 py-2 hover:bg-zinc-200"
      >
        <Text class={`w-3 text-xs text-zinc-500 transition-transform ${open() ? "rotate-90" : ""}`}>▶</Text>
        <Text class={`flex-1 text-sm font-semibold ${holdsCurrent() && !open() ? "text-zinc-900 underline" : "text-zinc-800"}`}>
          {props.group.title}
        </Text>
        <Text class="text-[11px] text-zinc-400">{props.group.features.length}</Text>
      </View>
      {open() ? props.group.features.map((f) => <SidebarItem feature={f} />) : null}
    </View>
  );
}

function Sidebar() {
  return (
    <View class="w-64 border-r border-zinc-200 bg-zinc-50">
      <View class="px-4 pt-5 pb-3">
        <Text class="text-lg font-bold text-zinc-900">NSH demo</Text>
        <Text class="text-xs text-zinc-500">Features to try by hand</Text>
      </View>
      <HoverScroll style={{ paddingHorizontal: 8, paddingBottom: 24, gap: 4 }}>
        {groups.map((g) => (
          <SidebarGroup group={g} />
        ))}
      </HoverScroll>
    </View>
  );
}

function App() {
  return (
    <View class="flex-1 flex flex-row bg-white">
      <Sidebar />
      <View class="flex-1">
        {() => {
          const Page = (all.find((f) => f.id === current()) ?? all[0]).page;
          return <Page />;
        }}
      </View>
    </View>
  );
}

// The window's size comes from `nsh run --window-size 1440x900` (README.md):
// the host then opens it centered at that size, which resizing it from here
// would undo (a resize keeps the left edge).
if (hasWindow) Window.setTitle("NSH Demo");

mount(App);
